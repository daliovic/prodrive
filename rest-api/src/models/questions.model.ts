import { Document, model, Schema } from 'mongoose';

import { Question } from '@/interfaces/questions.interface';

const questionSchema: Schema = new Schema({
  questionAnnouncement: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  answerA: {
    type: String,
    required: true,
  },
  answerB: {
    type: String,
    required: true,
  },
  answerC: {
    type: String,
    required: true,
  },
  answerD: {
    type: String,
    required: true,
  },
  filesName: {
    type: Array,
    required: true,
  },

  chapter: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  correctAnswers: {
    type: Array,
    required: true,
  },
});

const questionModel = model<Question & Document>('Question', questionSchema);

export default questionModel;
