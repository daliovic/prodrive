import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { CreateAdminDto } from '@dtos/admins.dto';
import { CreateDriverDto } from '@dtos/drivers.dto';
import { CreateTransporterDto } from '@dtos/transporters.dto';
import { SignInAdminDto, SignInDriverDto, SignInTransporterDto, SignInUserDto } from '@dtos/users.dto';
import { Admin } from '@interfaces/admins.interface';
import { RequestWithAllUsers } from '@interfaces/auth.interface';
import { Driver } from '@interfaces/drivers.interface';
import { Transporter } from '@interfaces/transporters.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userType = req.query.userType;
      switch (userType) {
        case 'admin':
          const adminData: CreateAdminDto = req.body;
          const signUpAdminData: Admin = await this.authService.signup(adminData);
          res.status(201).json({ data: signUpAdminData, message: 'signup' });
          break;
        case 'transporter':
          const transporterData: CreateTransporterDto = req.body;
          const signUpTransporterData: Transporter | Admin | Driver = await this.authService.signup(transporterData);
          res.status(201).json({ data: signUpTransporterData, message: 'signup' });
          break;
        case 'driver':
          const driverData: CreateDriverDto = req.body;
          const signUpDriverData: Transporter | Admin | Driver = await this.authService.signup(driverData);
          res.status(201).json({ data: signUpDriverData, message: 'signup' });
          break;
        default:
          throw new HttpException(404, `userType not specified`);
      }
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInUserData: SignInUserDto = req.body;
      const { cookie, findUser } = await this.authService.login(signInUserData);
      res.setHeader('Set-Cookie', [cookie]);
      // res.cookie('auth', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logInAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInUserData: SignInAdminDto = req.body;
      const { cookie, findUser } = await this.authService.loginAdmin(signInUserData);
      res.setHeader('Set-Cookie', [cookie]);
      // res.cookie('auth', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logInTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInUserData: SignInTransporterDto = req.body;
      const { cookie, findUser } = await this.authService.loginTransporter(signInUserData);
      res.setHeader('Set-Cookie', [cookie]);
      // res.cookie('auth', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logInDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInDriverData: SignInDriverDto = req.body;
      const { cookie, findUser } = await this.authService.loginDriver(signInDriverData);
      res.setHeader('Set-Cookie', [cookie]);
      // res.cookie('auth', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithAllUsers, res: Response, next: NextFunction) => {
    try {
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
