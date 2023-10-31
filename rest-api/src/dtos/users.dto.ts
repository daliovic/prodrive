import { IsEmail, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
export class SignInUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
export class SignInAdminDto {
  @IsEmail()
  public email: string;
  @IsString()
  public token: string;
  @IsString()
  public password: string;
}
export class SignInTransporterDto {
  @IsEmail()
  public email: string;
  @IsString()
  public token: string;
  @IsString()
  public password: string;
}
export class SignInDriverDto {
  @IsEmail()
  public email: string;
  @IsString()
  public token: string;
  @IsString()
  public password: string;
  @IsBoolean()
  public accept: boolean;
}
