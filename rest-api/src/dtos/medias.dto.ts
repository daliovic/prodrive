import { IsString, IsUrl } from 'class-validator';

export class CreateMediaDto {
  @IsUrl()
  public url: string;
  @IsString()
  public description: string;
  @IsString()
  public type: string;
}
