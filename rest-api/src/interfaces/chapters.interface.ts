import { Transporter } from '@interfaces/transporters.interface';
import { Question } from '@interfaces/questions.interface';

export interface Chapter {
  _id: string;
  title: string;
  category: string;
  description: string;
  questions: [Question];
  transporters: [Transporter];
}
