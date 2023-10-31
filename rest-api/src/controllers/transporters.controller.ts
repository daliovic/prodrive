import { NextFunction, Request, Response } from 'express';

import { CreateTransporterDto } from '@dtos/transporters.dto';
import { Transporter } from '@interfaces/transporters.interface';
import transporterService from '@services/transporters.service';

class TransportersController {
  public transporterService = new transporterService();

  public getTransporters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTransportersData: Transporter[] = await this.transporterService.findAllTransporter();

      res.status(200).json({ data: findAllTransportersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTransporterById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const findOneTransporterData: Transporter = await this.transporterService.findTransporterById(transporterId);

      res.status(200).json({ data: findOneTransporterData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterData: CreateTransporterDto = req.body;
      const createTransporterData: Transporter = await this.transporterService.createTransporter(transporterData);

      res.status(201).json({ data: createTransporterData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const transporterData: CreateTransporterDto = req.body;
      const updateTransporterData: Transporter = await this.transporterService.updateTransporter(transporterId, transporterData);

      res.status(200).json({ data: updateTransporterData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTransporter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const deleteTransporterData: Transporter = await this.transporterService.deleteTransporter(transporterId);

      res.status(200).json({ data: deleteTransporterData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TransportersController;
