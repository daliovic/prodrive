import { Document, model, Schema } from 'mongoose';

import { Driver } from '@interfaces/drivers.interface';

const driverSchema: Schema = new Schema({
  drivingLicenseNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  civility: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  transporter: {
    type: Schema.Types.ObjectId,
    ref: 'Transporter',
  },
  isActive: {
    type: Boolean,
  },
  token: {
    type: String,
  },
});

const driverModel = model<Driver & Document>('Driver', driverSchema);

export default driverModel;
