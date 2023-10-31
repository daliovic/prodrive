import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, IsDateString, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  public _id: string;
  @IsInt()
  public drivingLicenseNumber: number;
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsString()
  public lastName: string;
  @IsEmail()
  public email: string;
  @IsPhoneNumber()
  public phone: string;
  @IsString()
  @IsNotEmpty()
  public civility: string;
  @IsDateString()
  public birthDate: Date;
  @IsDateString()
  public creationDate: Date;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public password: string;
  @IsBoolean()
  isActive: boolean;
  @IsString()
  transporter: string;
}
