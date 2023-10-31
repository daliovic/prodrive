import { Chapter } from '@interfaces/chapters.interface';
import { Driver } from '@interfaces/drivers.interface';

export interface Transporter {
  _id: string;
  name: string;
  lastName: string;
  assignment: string;
  email: string;
  phone: string;
  companyName: string;
  SIRETNumber: number;
  address: string;
  ZIPCode: number;
  country: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  password: string;
  chapters: [Chapter];
  drivers: [Driver];
}
