import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithAllUsers } from '@interfaces/auth.interface';
import adminModel from '@models/admins.model';
import driverModel from '@models/drivers.model';
import transporterModel from '@models/transporters.model';

const authMiddleware = async (req: RequestWithAllUsers, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;
    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = jwt.verify(Authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse._id;

      let findUser = await adminModel.findById(userId);
      if (!findUser) {
        findUser = await transporterModel.findById(userId);
        if (!findUser) {
          findUser = await driverModel.findById(userId);
          if (!findUser) {
            next(new HttpException(401, 'Wrong authentication token'));
          }
        }
      }
      req.user = findUser;
      next();
      console.log('req.user');
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
