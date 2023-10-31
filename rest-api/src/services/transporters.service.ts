import bcrypt from 'bcrypt';
import moment from 'moment';

import { Admin } from '@/interfaces/admins.interface';
import { Driver } from '@/interfaces/drivers.interface';
import { CreateTransporterDto } from '@dtos/transporters.dto';
import { HttpException } from '@exceptions/HttpException';
import { Transporter } from '@interfaces/transporters.interface';
import adminModel from '@models/admins.model';
import chapterModel from '@models/chapters.model';
import driverModel from '@models/drivers.model';
import transporterModel from '@models/transporters.model';
import { isEmpty } from '@utils/util';
import AccountService from '@services/acccounts.service';

class TransporterService {
  public transporters = transporterModel;
  public admins = adminModel;
  public drivers = driverModel;
  public chapters = chapterModel;

  public async findAllTransporter(): Promise<Transporter[]> {
    const _transporters: Transporter[] = await this.transporters.find();
    for (let index = 0; index < _transporters.length; index++) {
      const now = moment();
      const endDate = moment(_transporters[index].endDate).add(1, 'days');

      if (now > endDate) {
        await this.transporters.findOneAndUpdate({ email: _transporters[index].email }, { isActive: false });
        //Inherit the desactivate status to all drivers
      }
    }
    const transporters: Transporter[] = await this.transporters.find();
    return transporters;
  }

  public async findTransporterById(transporterId: string): Promise<Transporter> {
    if (isEmpty(transporterId)) throw new HttpException(400, "You're not transporterId");

    const findTransporter: Transporter = await this.transporters.findOne({ _id: transporterId });
    if (!findTransporter) throw new HttpException(409, "You're not transporterId");

    return findTransporter;
  }

  public async createTransporter(transporterData: CreateTransporterDto): Promise<Transporter> {
    if (isEmpty(transporterData)) throw new HttpException(400, "You're not transporterData");

    const findTransporter: Transporter = await this.transporters.findOne({ email: transporterData.email });
    const findDriver: Driver = await this.drivers.findOne({ email: transporterData.email });
    const findAdmin: Admin = await this.admins.findOne({ email: transporterData.email });

    if (findTransporter || findDriver || findAdmin) throw new HttpException(409, `You're email ${transporterData.email} already exists`);

    const hashedPassword = await bcrypt.hash(transporterData.password, 10);
    const createTransporterData: Transporter = await this.transporters.create({ ...transporterData, password: hashedPassword });

    const accountService = new AccountService(transporterData as any);
    await accountService.sendTransporterEmailWithAccountParams();
    const chapterIds = transporterData.chapters;
    chapterIds.map(async (chapterId: any) => {
      await this.chapters.findByIdAndUpdate(chapterId, { $push: { transporters: transporterData._id } }, { new: true, useFindAndModify: false });
    });

    return createTransporterData;
  }

  public async updateTransporter(transporterId: string, transporterData: CreateTransporterDto): Promise<Transporter> {
    console.log('🚀 ~ file: transporters.service.ts ~ line 66 ~ TransporterService ~ updateTransporter ~ transporterData', transporterData);

    if (isEmpty(transporterData)) throw new HttpException(400, "You're not transporterData");
    if (transporterData.email) {
      const findTransporter: Transporter = await this.transporters.findOne({ email: transporterData.email });
      if (findTransporter && findTransporter._id != transporterId)
        throw new HttpException(409, `You're email ${transporterData.email} already exists`);
    }

    if (transporterData.password && transporterData.password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(transporterData.password, 10);
      transporterData = { ...transporterData, password: hashedPassword };
    } else {
      const { password, ..._transporterData }: any = transporterData;
      transporterData = _transporterData;
    }

    const _transporter: any = { ...transporterData };
    const updateTransporterById: Transporter = await this.transporters.findByIdAndUpdate(transporterId, _transporter, { returnDocument: 'after' });
    if (!updateTransporterById) throw new HttpException(409, "You're not transporter");
    return updateTransporterById;
  }

  public async deleteTransporter(transporterId: string): Promise<Transporter> {
    const deleteTransporterById: Transporter = await this.transporters.findByIdAndDelete(transporterId);
    if (!deleteTransporterById) throw new HttpException(409, "You're not transporter");

    return deleteTransporterById;
  }
}

export default TransporterService;
