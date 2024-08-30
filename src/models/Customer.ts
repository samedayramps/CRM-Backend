import mongoose, { Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);