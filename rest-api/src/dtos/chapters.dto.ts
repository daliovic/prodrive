import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  public _id: string;
  @IsString()
  @IsNotEmpty()
  public title: string;
  @IsString()
  @IsNotEmpty()
  public category: string;
  @IsString()
  @IsNotEmpty()
  public description: string;
}
