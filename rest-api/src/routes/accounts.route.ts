import { Router } from 'express';

import MailingController from '@controllers/accounts.controller';
import { Routes } from '@interfaces/routes.interface';

class AccountRoute implements Routes {
  public path = '/';
  public router = Router();
  public mailingController = new MailingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}createAccount`, this.mailingController.sendDriverEmailWithToken);
    this.router.post(`${this.path}sendTransporterEmail`, this.mailingController.sendTrasporterEmailDriverValidation);
    // this.router.get(`${this.path}verify/:id/`, this.mailingController.verifyAccount);
    this.router.get(`${this.path}validateExam`, this.mailingController.sendCertifDriver);
  }
}

export default AccountRoute;
