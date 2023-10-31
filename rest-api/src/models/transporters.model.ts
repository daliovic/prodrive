import { Document, model, Schema } from 'mongoose';

import { Transporter } from '@interfaces/transporters.interface';

const transporterSchema: Schema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  assignment: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  SIRETNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ZIPCode: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
  chapters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  ],
  drivers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
    },
  ],
});

const transporterModel = model<Transporter & Document>('Transporter', transporterSchema);

export default transporterModel;
