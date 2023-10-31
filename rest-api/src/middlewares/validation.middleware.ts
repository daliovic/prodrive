import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import { HttpException } from '@exceptions/HttpException';

const validationUserMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  const [adminType, transporterType, driverType] = type;
  return (req: Request, res: Response, next: NextFunction) => {
    const userType = req.query.userType;
    console.log(req);
    switch (userType) {
      case 'admin':
        validate(plainToClass(adminType, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then(
          (errors: ValidationError[]) => {
            if (errors.length > 0) {
              const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
              next(new HttpException(400, message));
            } else {
              next();
            }
          },
        );
        break;
      case 'transporter':
        validate(plainToClass(transporterType, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then(
          (errors: ValidationError[]) => {
            if (errors.length > 0) {
              const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
              next(new HttpException(400, message));
            } else {
              next();
            }
          },
        );

        break;
      case 'driver':
        validate(plainToClass(driverType, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then(
          (errors: ValidationError[]) => {
            if (errors.length > 0) {
              const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
              next(new HttpException(400, message));
            } else {
              next();
            }
          },
        );
        break;
      default:
        throw new HttpException(404, `userType  not specified`);
    }
  };
};

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).files && (req as any).files.length) {
      req.body.filesName = [];
      (req as any).files.forEach((file: any) => {
        if (file) {
          req.body.filesName.push(file.filename);
        }
      });
    }
    validate(plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export { validationMiddleware, validationUserMiddleware };
