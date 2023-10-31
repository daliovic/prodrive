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
  isActive: string;
  transporter: string;
  //isActive
  //sessionCode
  //codeDuration
}
