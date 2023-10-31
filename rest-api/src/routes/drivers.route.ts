import { Router } from 'express';

import DriversController from '@/controllers/drivers.controller';
import { CreateDriverDto } from '@dtos/drivers.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';

class DriversRoute implements Routes {
  public path = '/drivers';
  public transporterRessource = '/transporters';
  public router = Router();
  public driversController = new DriversController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.driversController.getDrivers);
    this.router.get(`${this.path}/:driverId`, authMiddleware, this.driversController.getDriverById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateDriverDto, 'body'), this.driversController.createDriver);
    this.router.put(
      `${this.path}/:driverId`,
      authMiddleware,
      validationMiddleware(CreateDriverDto, 'body', true),
      this.driversController.updateDriver,
    );
    this.router.delete(`${this.path}/:driverId`, authMiddleware, this.driversController.deleteDriver);

    //driver - transporter
    this.router.get(`${this.path}${this.transporterRessource}/:transporterId`, authMiddleware, this.driversController.getAllDriversForTransporter);
    this.router.delete(
      `${this.path}/:driverId${this.transporterRessource}/:transporterId`,
      authMiddleware,
      this.driversController.deleteDriverForTransporter,
    );
    this.router.post(
      `${this.path}/:transporterId`,
      authMiddleware,
      validationMiddleware(CreateDriverDto, 'body'),
      this.driversController.createDriverForTransporter,
    );
  }
}

export default DriversRoute;
