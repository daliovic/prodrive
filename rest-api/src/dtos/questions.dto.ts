import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  public _id: string;
  @IsString()
  @IsNotEmpty()
  public questionAnnouncement: string;
  @IsString()
  @IsNotEmpty()
  public category: string;
  @IsString()
  @IsNotEmpty()
  public answerA: string;
  @IsString()
  @IsNotEmpty()
  public answerB: string;
  @IsString()
  @IsNotEmpty()
  public answerC: string;
  @IsString()
  @IsNotEmpty()
  public answerD: string;
  @IsString()
  public chapter: string;
  @IsArray()
  public filesName: string[];
  @IsArray()
  public correctAnswers: string[];
}
