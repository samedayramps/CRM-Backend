// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

interface RampComponent {
  type: 'ramp' | 'landing';
  length: number;
  width?: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

interface PricingCalculations {
  deliveryFee: number;
  installFee: number;
  monthlyRentalRate: number;
  totalUpfront: number; // Changed from totalAmount
  distance: number;
  warehouseAddress: string; // Changed from companyAddress
}

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  customerName: string;
  rentalRequestId?: Types.ObjectId;
  rampConfiguration: RampConfiguration;
  pricingCalculations: PricingCalculations;
  status: 'draft' | 'sent' | 'accepted' | 'paid' | 'completed';
  createdAt: Date;
  manualSignature?: string; // Add this line
  signatureDate?: Date; // Add this line
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: {
    components: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      width: { type: Number, required: false }
    }],
    totalLength: { type: Number, required: true }
  },
  pricingCalculations: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRentalRate: { type: Number, required: true },
    totalUpfront: { type: Number, required: true }, // Changed from totalAmount
    distance: { type: Number, required: true },
    warehouseAddress: { type: String, required: true } // Changed from companyAddress
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'paid', 'completed'], 
    default: 'draft' 
  },
  createdAt: { type: Date, default: Date.now },
  manualSignature: { type: String, required: false }, // Add this line
  signatureDate: { type: Date, required: false } // Add this line
});

// Enable virtuals in JSON output if needed
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = model<IQuote>('Quote', quoteSchema);