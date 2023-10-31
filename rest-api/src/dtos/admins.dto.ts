import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  public name: string;
  @IsString()
  public lastName: string;
  @IsEmail()
  public email: string;
  @IsPhoneNumber()
  public phone: string;
  @IsString()
  public password: string;
}
