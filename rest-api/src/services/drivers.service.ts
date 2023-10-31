import bcrypt from 'bcrypt';
import moment from 'moment';

import { Transporter } from '@/interfaces/transporters.interface';
import { generateToken } from '@/utils/tokenGen';
import { CreateDriverDto } from '@dtos/drivers.dto';
import { HttpException } from '@exceptions/HttpException';
import { Driver } from '@interfaces/drivers.interface';
import driverModel from '@models/drivers.model';
import transporterModel from '@models/transporters.model';
import AccountService from '@services/acccounts.service';
import { isEmpty } from '@utils/util';

class DriverService {
  public drivers = driverModel;
  public transporters = transporterModel;

  public async findAllDriver(): Promise<Driver[]> {
    const _drivers: Driver[] = await this.drivers.find();

    for (let index = 0; index < _drivers.length; index++) {
      const now = moment();
      const endDate = moment(_drivers[index].creationDate).add(3, 'hours');

      if (now > endDate) {
        await this.drivers.findOneAndUpdate({ email: _drivers[index].email }, { isActive: false });
      }
    }
    const drivers: Driver[] = await this.drivers.find();
    return drivers;
  }

  public async findDriverById(driverId: string): Promise<Driver> {
    if (isEmpty(driverId)) throw new HttpException(400, "You're not driverId");

    const findDriver: Driver = await this.drivers.findOne({ _id: driverId });
    if (!findDriver) throw new HttpException(409, "You're not driverId");

    return findDriver;
  }
  public async findDriverEmail(driverEmail: string): Promise<Driver> {
    if (isEmpty(driverEmail)) throw new HttpException(400, "You're not driverId");

    const findDriver: Driver = await this.drivers.findOne({ email: driverEmail });
    if (!findDriver) throw new HttpException(409, "You're not driverEmail");

    return findDriver;
  }

  public async createDriver(driverData: CreateDriverDto): Promise<Driver> {
    if (isEmpty(driverData)) throw new HttpException(400, "You're not driverData");

    const findDriver: Driver = await this.drivers.findOne({ email: driverData.email });
    if (findDriver) throw new HttpException(409, `You're email ${driverData.email} already exists`);

    const hashedPassword = await bcrypt.hash(driverData.password, 10);
    const token = generateToken();
    const createDriverData: Driver = await this.drivers.create({ ...driverData, password: hashedPassword, token });
    const findTransporter: Transporter = await this.transporters.findById(createDriverData.transporter);
    const _driverData = { token, companyName: findTransporter.companyName, ...driverData };
    const accountService = new AccountService(_driverData as any);
    const transporterId = driverData.transporter;
    await accountService.sendDriverEmailWithToken();
    await this.transporters.findByIdAndUpdate(transporterId, { $push: { drivers: driverData._id } }, { new: true, useFindAndModify: false });
    return createDriverData;
  }

  public async updateDriver(driverId: string, driverData: CreateDriverDto): Promise<Driver> {
    if (isEmpty(driverData)) throw new HttpException(400, "You're not driverData");
    let findDriver: Driver;
    if (driverData.email) {
      findDriver = await this.drivers.findOne({ email: driverData.email });
      if (findDriver && findDriver._id != driverId) throw new HttpException(409, `You're email ${driverData.email} already exists`);
    }
    let unhashedPassword;
    if (driverData.password) {
      unhashedPassword = driverData.password;
      const hashedPassword = await bcrypt.hash(driverData.password, 10);
      driverData = { ...driverData, password: hashedPassword };
    }
    const token = generateToken();
    const updateDriverById: Driver = await this.drivers.findByIdAndUpdate(driverId, { ...driverData, token }, { returnDocument: 'after' });
    if (!updateDriverById) throw new HttpException(409, "You're not driver");
    if (driverData.isActive === true && findDriver.isActive === false) {
      driverData['password'] = unhashedPassword;
      const findTransporter: Transporter = await this.transporters.findById(findDriver.transporter);
      const _driverData = { token, companyName: findTransporter.companyName, ...driverData };
      const accountService = new AccountService(_driverData as any);
      await accountService.sendDriverEmailWithToken();
    }

    return updateDriverById;
  }

  public async deleteDriver(driverId: string): Promise<Driver> {
    const deleteDriverById: Driver = await this.drivers.findByIdAndDelete(driverId);
    if (!deleteDriverById) throw new HttpException(409, "You're not driver");

    return deleteDriverById;
  }

  public async createDriverForTransporter(transporterId: string, driverData: CreateDriverDto): Promise<Driver> {
    if (isEmpty(transporterId)) throw new HttpException(400, "You're not transporterId");
    if (isEmpty(driverData)) throw new HttpException(400, "You're not driverData");

    const findDriver: Driver = await this.drivers.findOne({ email: driverData.email });
    if (findDriver) throw new HttpException(409, `You're email ${driverData.email} already exists`);

    const hashedPassword = await bcrypt.hash(driverData.password, 10);
    const createDriverData: Driver = await this.drivers.create({ ...driverData, password: hashedPassword, transporter: transporterId });
    await this.transporters.findByIdAndUpdate(transporterId, { $push: { drivers: createDriverData._id } }, { new: true, useFindAndModify: false });

    return createDriverData;
  }

  public async deleteDriverForTransporter(transporterId: string, driverId: string): Promise<Driver> {
    if (isEmpty(transporterId)) throw new HttpException(400, "You're not transporterId");
    if (isEmpty(driverId)) throw new HttpException(400, "You're not driverId");

    const deleteDriverById: Driver = await this.drivers.findByIdAndDelete(driverId);
    if (!deleteDriverById) throw new HttpException(409, "You're not driver");
    await this.transporters.findByIdAndUpdate(transporterId, { $pull: { drivers: driverId } }, { new: true, useFindAndModify: false });
    return deleteDriverById;
  }

  public async findAllDriversForTransporter(transporterId: string): Promise<Driver[]> {
    if (isEmpty(transporterId)) throw new HttpException(400, "You're not transporterId");
    const transporters: Transporter[] = await this.transporters.find({ _id: transporterId }, { drivers: 1 }).populate('drivers', { password: 0 });

    return transporters[0].drivers;
  }
}

export default DriverService;
