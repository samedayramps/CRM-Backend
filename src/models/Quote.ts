// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

interface RampComponent {
  type: 'ramp' | 'landing';
  length: number;
  quantity: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  customerName: string;
  rentalRequestId?: Types.ObjectId;
  rampConfiguration: RampConfiguration;
  pricingCalculations: {
    deliveryFee: number;
    installFee: number;
    monthlyRentalRate: number;
    totalUpfront: number;
    distance: number;
    warehouseAddress: string;
  };
  status: 'draft' | 'sent' | 'accepted' | 'paid' | 'completed';
  createdAt: Date;
  manualSignature?: string;
  signatureDate?: Date;
  installAddress: string;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paymentIntentId?: string;
  agreementStatus: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  agreementId?: string;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: {
    components: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }],
    totalLength: { type: Number, required: true }
  },
  pricingCalculations: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRentalRate: { type: Number, required: true },
    totalUpfront: { type: Number, required: true },
    distance: { type: Number, required: true },
    warehouseAddress: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'paid', 'completed'], 
    default: 'draft' 
  },
  createdAt: { type: Date, default: Date.now },
  manualSignature: { type: String, required: false },
  signatureDate: { type: Date, required: false },
  installAddress: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentIntentId: { type: String, required: false },
  agreementStatus: { 
    type: String, 
    enum: ['pending', 'sent', 'viewed', 'signed', 'declined'], 
    default: 'pending' 
  },
  agreementId: { type: String, required: false }
});

// Enable virtuals in JSON output if needed
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = model<IQuote>('Quote', quoteSchema);