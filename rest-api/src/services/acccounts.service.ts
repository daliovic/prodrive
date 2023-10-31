import { Transporter } from '@/interfaces/transporters.interface';
import { genratePdf } from '@/utils/generateCertif';
import Mailing from '@/utils/mailing';
import {
  driverEmailWithTokenTemplate,
  sendTrasporterEmailDriverValidationTemplate,
  transporterEmailWithAccountParamsTemplate,
} from '@/utils/mailingTemplates';
import { HttpException } from '@exceptions/HttpException';
import { Driver } from '@interfaces/drivers.interface';
import driverModel from '@models/drivers.model';
import transporterModel from '@models/transporters.model';
import transporterService from '@services/transporters.service';

class AccountService {
  public drivers = driverModel;
  public transporters = transporterModel;
  public transporterService = new transporterService();
  mailing = new Mailing();
  data: any;
  public constructor(data: any) {
    this.data = data;
  }

  public async sendDriverEmailWithToken(): Promise<any> {
    const emailBody = driverEmailWithTokenTemplate(this.data);
    const emailResponse = await this.mailing.sendEmail(this.data.email, 'confirmation email', emailBody);
    return emailResponse;
  }

  public async sendTransporterEmailWithAccountParams(): Promise<any> {
    const emailBody = transporterEmailWithAccountParamsTemplate(this.data);
    const emailResponse = await this.mailing.sendEmail(this.data.email, 'Welcome To Prodive', emailBody);
    return emailResponse;
  }

  public async sendTrasporterEmailDriverValidation(): Promise<any> {
    const findTransporterData: Transporter = await this.transporterService.findTransporterById(this.data.transporterId);
    const emailBody = sendTrasporterEmailDriverValidationTemplate(this.data);
    const emailResponse = await this.mailing.sendEmail(findTransporterData.email, 'prodrive succes exam', emailBody);
    return emailResponse;
  }
  public async sendCertifDriver(): Promise<any> {
    const findDriver: Driver = await this.drivers.findOne({ email: this.data });
    if (!findDriver) throw new HttpException(409, `You're email ${findDriver.email}  not found`);
    const findTransporter: Transporter = await this.transporters.findById(findDriver.transporter);
    genratePdf(findDriver, findTransporter);
    const attachments = [
      {
        filename: `${findDriver.name}${findDriver.lastName}${findDriver._id}.pdf`,
        path: `./public/certifs/${findDriver.name}${findDriver.lastName}${findDriver._id}.pdf`,
        contentType: 'application/pdf',
      },
    ];
    const emailBody = `<h5>Congratulation below is your certif</h5>`;
    const emailResponse = await this.mailing.sendEmail(this.data, 'prodrive succes exam', emailBody, attachments);
    return emailResponse;
  }

  // public async verifyAccount(): Promise<any> {
  //   const { _id, token, email } = this.data;
  //   const findDriver: Driver = await this.drivers.findByIdAndUpdate(_id, { token });
  //   if (!findDriver) throw new HttpException(409, `You're email not verfied`);
  //   const emailBody = `<h5>Your session started from this moment you have only four hours </h5>`;
  //   await this.mailing.sendEmail(email, 'Pro drive confirmed email', emailBody);

  //   return findDriver;
  // }
}

export default AccountService;
