// src/models/RentalRequest.ts
import { Schema, model, Document } from 'mongoose';

export interface IRentalRequest extends Document {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  rampDetails: {
    knowRampLength: boolean;
    rampLength?: number;
    knowRentalDuration: boolean;
    rentalDuration?: number;
    installTimeframe: string;
    mobilityAids: string[];
  };
  installAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const rentalRequestSchema = new Schema<IRentalRequest>({
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  rampDetails: {
    knowRampLength: { type: Boolean, required: true },
    rampLength: { type: Number },
    knowRentalDuration: { type: Boolean, required: true },
    rentalDuration: { type: Number },
    installTimeframe: {
      type: String,
      enum: ['Within 24 hours', 'Within 2 days', 'Within 3 days', 'Within 1 week', 'Over 1 week'],
      required: true,
    },
    mobilityAids: { type: [String], required: true },
  },
  installAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rentalRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const RentalRequest = model<IRentalRequest>('RentalRequest', rentalRequestSchema);