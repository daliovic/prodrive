export interface Question {
  _id: string;
  questionAnnouncement: string;
  category: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  chapter: string;
  correctAnswers: string[];
  filesName: string[];
}
