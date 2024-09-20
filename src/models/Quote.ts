// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  customerName: string;
  rentalRequestId?: Types.ObjectId;
  rampConfiguration: {
    components: string[];
    totalLength: number;
  };
  pricingCalculations: {
    deliveryFee: number;
    installFee: number;
    monthlyRentalRate: number;
    totalAmount: number;
    distance: number;
  };
  createdAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: {
    components: { type: [String], required: true },
    totalLength: { type: Number, required: true },
  },
  pricingCalculations: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRentalRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    distance: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

// Enable virtuals in JSON output if needed
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = model<IQuote>('Quote', quoteSchema);