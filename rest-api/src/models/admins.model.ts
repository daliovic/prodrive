import { Document, model, Schema } from 'mongoose';

import { Admin } from '@interfaces/admins.interface';

const adminSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const adminModel = model<Admin & Document>('Admin', adminSchema);

export default adminModel;
