import { Router } from 'express';

import AuthController from '@controllers/auth.controller';
import { CreateAdminDto } from '@dtos/admins.dto';
import { CreateDriverDto } from '@dtos/drivers.dto';
import { CreateTransporterDto } from '@dtos/transporters.dto';
import { SignInDriverDto, SignInUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware, validationUserMiddleware } from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      validationUserMiddleware([CreateAdminDto, CreateTransporterDto, CreateDriverDto], 'body'),
      this.authController.signUp,
    );
    this.router.post(`${this.path}loginAdmin`, validationMiddleware(SignInUserDto, 'body'), this.authController.logInAdmin);
    this.router.post(`${this.path}loginTransporter`, validationMiddleware(SignInUserDto, 'body'), this.authController.logInTransporter);
    this.router.post(`${this.path}loginDriver`, validationMiddleware(SignInDriverDto, 'body'), this.authController.logInDriver);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
