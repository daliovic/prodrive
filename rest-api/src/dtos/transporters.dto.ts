import { IsArray, IsDateString, IsEmail, IsInt, IsPhoneNumber, IsString, IsBoolean } from 'class-validator';

export class CreateTransporterDto {
  @IsString()
  public _id: string;
  @IsString()
  public name: string;
  @IsString()
  public lastName: string;
  @IsString()
  public assignment: string;
  @IsEmail()
  public email: string;
  @IsPhoneNumber()
  public phone: string;
  @IsString()
  public companyName: string;
  @IsInt()
  public SIRETNumber: number;
  @IsString()
  public address: string;
  @IsInt()
  public ZIPCode: number;
  @IsString()
  public country: string;
  @IsDateString()
  public startDate: Date;
  @IsDateString()
  public endDate: Date;
  @IsString()
  public password: string;
  @IsBoolean()
  isActive: boolean;
  @IsArray()
  public chapters: string[];
}
