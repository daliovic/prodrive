import { Router } from 'express';

import TransportersController from '@controllers/transporters.controller';
import { CreateTransporterDto } from '@dtos/transporters.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';

class TransportersRoute implements Routes {
  public path = '/transporters';
  public driversRessource = '/drivers';
  public chaptersRessource = '/chapters';
  public router = Router();
  public transportersController = new TransportersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.transportersController.getTransporters);
    this.router.get(`${this.path}/:transporterId`, authMiddleware, this.transportersController.getTransporterById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateTransporterDto, 'body'),
      this.transportersController.createTransporter,
    );
    this.router.put(
      `${this.path}/:transporterId`,
      authMiddleware,
      validationMiddleware(CreateTransporterDto, 'body', true),
      this.transportersController.updateTransporter,
    );
    this.router.delete(`${this.path}/:transporterId`, authMiddleware, this.transportersController.deleteTransporter);
    this.router.get(`${this.path}/:transporterId${this.driversRessource}`, authMiddleware, this.transportersController.getTransporters);
  }
}

export default TransportersRoute;
