export interface Driver {
  _id: string;
  drivingLicenseNumber: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  civility: string;
  birthDate: Date;
  creationDate: Date;
  password: string;
  isActive: boolean;
  token: string;
  transporter: string;
}
