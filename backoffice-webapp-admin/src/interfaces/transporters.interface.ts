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
  startDate: Date | undefined;
  endDate: Date | undefined;
  password: string;
  chapters: string[];
  isActive: boolean;
}
