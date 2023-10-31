import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { SignInAdminDto, SignInDriverDto, SignInTransporterDto, SignInUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { Admin } from '@interfaces/admins.interface';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { Driver } from '@interfaces/drivers.interface';
import { Transporter } from '@interfaces/transporters.interface';
import { User } from '@interfaces/users.interface';
import adminModel from '@models/admins.model';
import driverModel from '@models/drivers.model';
import transporterModel from '@models/transporters.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public admins = adminModel;
  public transporters = transporterModel;
  public drivers = driverModel;

  public async signup(userData): Promise<Admin | Transporter | Driver> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const findTransporter: Transporter = await this.transporters.findOne({ email: userData.email });
    const findDriver: Driver = await this.drivers.findOne({ email: userData.email });
    const findAdmin: Admin = await this.admins.findOne({ email: userData.email });

    if (findTransporter || findDriver || findAdmin) throw new HttpException(409, `You're email ${userData.email} already exists`);
    if (userData) {
      if (userData.companyName) {
        const transporterHashedPassword = await bcrypt.hash(userData.password, 10);
        const createTransporterData: Transporter = await this.transporters.create({
          ...userData,
          password: transporterHashedPassword,
        });
        return createTransporterData;
      } else if (userData.civility) {
        const findDriver: Driver = await this.drivers.findOne({ email: userData.email });
        if (findDriver) throw new HttpException(409, `You're email ${userData.email} already exists`);
        const driverHashedPassword = await bcrypt.hash(userData.password, 10);
        const createDriverData: Driver = await this.drivers.create({ ...userData, password: driverHashedPassword });
        return createDriverData;
      } else {
        //admin
        const findAdmin: Admin = await this.admins.findOne({ email: userData.email });
        if (findAdmin) throw new HttpException(409, `You're email ${userData.email} already exists`);
        const adminHashedPassword = await bcrypt.hash(userData.password, 10);
        const createAdminData: Admin = await this.admins.create({ ...userData, password: adminHashedPassword });
        return createAdminData;
      }
    }
  }

  public async login(userData: SignInUserDto): Promise<{ cookie: string; findUser: Admin }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    let findUser: Admin | Transporter | Driver = await this.admins.findOne({ email: userData.email });
    if (!findUser) {
      findUser = await this.transporters.findOne({ email: userData.email });
      if (!findUser) {
        findUser = await this.drivers.findOne({ email: userData.email });
        if (!findUser) {
          throw new HttpException(409, `You're email ${userData.email} not found`);
        }
      }
    }
    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser, 4);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async loginAdmin(userData: SignInAdminDto): Promise<{ cookie: string; findUser: Admin }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const findUserAdmin: Admin = await this.admins.findOne({ email: userData.email });
    if (!findUserAdmin) {
      throw new HttpException(409, `You're email ${userData.email} not found`);
    }
    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUserAdmin.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUserAdmin, 24 * 30);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser: findUserAdmin };
  }

  public async loginTransporter(transporterData: SignInTransporterDto): Promise<{ cookie: string; findUser: Transporter }> {
    if (isEmpty(transporterData)) throw new HttpException(400, "You're not userData");
    const findUserTransporter: Transporter = await this.transporters.findOne({ email: transporterData.email });
    if (!findUserTransporter) {
      throw new HttpException(409, `You're email ${transporterData.email} not found`);
    }
    const isPasswordMatching: boolean = await bcrypt.compare(transporterData.password, findUserTransporter.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const endDate = moment(findUserTransporter.endDate).add(1, 'days');
    const now = moment();
    if (now > endDate) {
      await this.transporters.findOneAndUpdate({ email: transporterData.email }, { isActive: false });
      throw new HttpException(409, "You're account is expired");
    }
    const startDate = moment(findUserTransporter.startDate);
    const duration = moment.duration(endDate.diff(startDate));
    const hours = duration.asHours();
    const tokenData = this.createToken(findUserTransporter, hours);

    const cookie = this.createCookie(tokenData);

    return { cookie, findUser: findUserTransporter };
  }

  public async loginDriver(driverData: SignInDriverDto): Promise<{ cookie: string; findUser: Driver }> {
    if (isEmpty(driverData)) throw new HttpException(400, "You're not userData");
    const findUserDriver: Driver = await this.drivers.findOne({ email: driverData.email });
    if (!findUserDriver) {
      throw new HttpException(409, `You're email ${driverData.email} not found`);
    }
    const isPasswordMatching: boolean = await bcrypt.compare(driverData.password, findUserDriver.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    if (findUserDriver.token !== driverData.token) {
      throw new HttpException(409, "You're code is wrong");
    }

    //FIXME Date Sysem UTC or local date
    const endDate = moment(findUserDriver.creationDate).add(3, 'hours');
    const now = moment();
    if (now > endDate) {
      await this.drivers.findOneAndUpdate({ email: driverData.email }, { $unset: { token: 1 }, isActive: false });
      throw new HttpException(409, "You're code is expired");
    }
    if (!driverData.accept) {
      throw new HttpException(409, 'You should accept the term of use');
    }
    const tokenData = this.createToken(findUserDriver, 4);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser: findUserDriver };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    let findUser: Admin | Transporter | Driver = await this.admins.findOne({ email: userData.email });
    if (!findUser) {
      findUser = await this.transporters.findOne({ email: userData.email });
      if (!findUser) {
        findUser = await this.drivers.findOne({ email: userData.email });
        if (!findUser) {
          throw new HttpException(409, `You're email ${userData.email} not found`);
        }
      }
    }

    return findUser;
  }

  public createToken(user: Admin, expirationTime: number): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = config.get('secretKey');
    // const expiresIn: number = 60 * 60;
    const hour: number = 60 * 60 * 1000;

    return { expiresIn: hour * expirationTime, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn: hour * expirationTime }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
