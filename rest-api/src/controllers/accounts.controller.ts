import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import AccountService from '@services/acccounts.service';
import DriverService from '@/services/drivers.service';
import { Driver } from '@interfaces/drivers.interface';

class AccountController {
  driverService = new DriverService();
  public sendDriverEmailWithToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailData = req.body;
      const accountService = new AccountService(emailData);

      const sendEmailOperation = await accountService.sendDriverEmailWithToken();
      if (sendEmailOperation) {
        res.status(201).json({ message: 'Email sent successfuly' });
      } else {
        throw new HttpException(500, `Mailing system has an internal server problem`);
      }
    } catch (error) {
      next(error);
    }
  };
  public sendTrasporterEmailDriverValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailData = req.body.data;

      const driverData: Driver = await this.driverService.findDriverEmail(emailData.emailDriver);
      const alldData = { driverData, transporterId: emailData.id };

      const accountService = new AccountService(alldData);
      const sendEmailOperation = await accountService.sendTrasporterEmailDriverValidation();
      if (sendEmailOperation) {
        res.status(201).json({ message: 'Email sent successfuly' });
      } else {
        throw new HttpException(500, `Mailing system has an internal server problem`);
      }
    } catch (error) {
      next(error);
    }
  };
  public sendCertifDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailData = req.query.emailDriver;
      const accountService = new AccountService(emailData);
      const sendEmailOperation = await accountService.sendCertifDriver();

      if (sendEmailOperation) {
        // res.status(201).json({ message: 'Email sent successfuly' });
        res.send(`<p>certification sent successfully to <b>${emailData} </b></p>`);
      } else {
        throw new HttpException(500, `Mailing system has an internal server problem`);
      }
    } catch (error) {
      next(error);
    }
  };

  // public verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const token = req.query.token;
  //     const email = req.query.email;
  //     const _id = req.params.id;
  //     const accountService = new AccountService({ _id, token, email });
  //     await accountService.verifyAccount();
  //     res.redirect(`${process.env.APP_HOST}?token=${token}`);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default AccountController;
