import { Admin } from '@interfaces/admins.interface';
import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { Transporter } from '@interfaces/transporters.interface';
import { Driver } from '@interfaces/drivers.interface';

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithAllUsers extends Request {
  user: User;
  admin: Admin;
  transporter: Transporter;
  driver: Driver;
}
