import nodemailer from 'nodemailer';

import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class Mailing {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  public async sendEmail(to: string, subject: string, html: string, attachments?: any[]): Promise<any> {
    if (isEmpty(to) || isEmpty(subject) || isEmpty(html)) throw new HttpException(400, 'email format wrong');
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // plain text body
      attachments,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          // resolve('internal server error'); // or use rejcet(false) but then you will have to handle errors
          resolve(error); // or use rejcet(false) but then you will have to handle errors
        } else {
          //   console.log('Email sent: ' + info.response);
          resolve(true);
        }
      });
    });
  }
}

export default Mailing;
