import { Document, model, Schema } from 'mongoose';

import { Chapter } from '@interfaces/chapters.interface';

const chapterSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  transporters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transporter',
    },
  ],
});

const chapterModel = model<Chapter & Document>('Chapter', chapterSchema);

export default chapterModel;
