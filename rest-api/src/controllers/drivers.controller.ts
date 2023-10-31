import { NextFunction, Request, Response } from 'express';

import { CreateDriverDto } from '@dtos/drivers.dto';
import { Driver } from '@interfaces/drivers.interface';
import driverService from '@services/drivers.service';

class DriversController {
  public driverService = new driverService();

  public getDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllDriversData: Driver[] = await this.driverService.findAllDriver();

      res.status(200).json({ data: findAllDriversData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getDriverById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverId: string = req.params.driverId;
      const findOneDriverData: Driver = await this.driverService.findDriverById(driverId);

      res.status(200).json({ data: findOneDriverData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverData: CreateDriverDto = req.body;
      const createDriverData: Driver = await this.driverService.createDriver(driverData);

      res.status(201).json({ data: createDriverData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverId: string = req.params.driverId;
      const driverData: CreateDriverDto = req.body;
      const updateDriverData: Driver = await this.driverService.updateDriver(driverId, driverData);

      res.status(200).json({ data: updateDriverData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverId: string = req.params.driverId;
      const deleteDriverData: Driver = await this.driverService.deleteDriver(driverId);

      res.status(200).json({ data: deleteDriverData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  //driver transporter
  public createDriverForTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const driverData: CreateDriverDto = req.body;
      const createDriverData: Driver = await this.driverService.createDriverForTransporter(transporterId, driverData);
      res.status(201).json({ data: createDriverData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  public getAllDriversForTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const findAllDriversForTransporterData: Driver[] = await this.driverService.findAllDriversForTransporter(transporterId);

      res.status(200).json({ data: findAllDriversForTransporterData, message: 'findAllDriversForTransporter' });
    } catch (error) {
      next(error);
    }
  };
  public deleteDriverForTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const driverId: string = req.params.driverId;
      const deleteDriverData: Driver = await this.driverService.deleteDriverForTransporter(transporterId, driverId);
      res.status(200).json({ data: deleteDriverData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default DriversController;
