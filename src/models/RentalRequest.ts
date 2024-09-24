// src/models/RentalRequest.ts
import { Schema, model, Document, Types } from 'mongoose';
import { SalesStage } from '../types/SalesStage';

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
  status: string;
  salesStage: SalesStage;
  customerId?: Types.ObjectId;
  quoteId?: Types.ObjectId;
  jobId?: Types.ObjectId;
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
    installTimeframe: { type: String, required: true },
    mobilityAids: { type: [String], required: true },
  },
  installAddress: { type: String, required: true },
  status: { type: String, required: true },
  salesStage: { type: String, enum: Object.values(SalesStage), default: SalesStage.RENTAL_REQUEST },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
}, { timestamps: true });

export const RentalRequest = model<IRentalRequest>('RentalRequest', rentalRequestSchema);