// src/models/SalesProcess.ts

import { Schema, model, Document, Types } from 'mongoose';

export enum SalesStage {
  CUSTOMER_INFO = 'CUSTOMER_INFO',
  RAMP_CONFIGURATION = 'RAMP_CONFIGURATION',
  QUOTE_SENT = 'QUOTE_SENT',
  AGREEMENT_SENT = 'AGREEMENT_SENT',
  INSTALL_SCHEDULED = 'INSTALL_SCHEDULED',
  JOB_COMPLETED = 'JOB_COMPLETED'
}

export interface ISalesProcess extends Document {
  stage: SalesStage;
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    installAddress: string;
    _id?: Types.ObjectId;
  };
  rampConfiguration?: {
    height?: number;
    components?: Array<{
      type: 'ramp' | 'landing';
      length: number;
      quantity: number;
    }>;
    totalLength?: number;
  };
  pricingCalculations?: {
    deliveryFee: number;
    installFee: number;
    monthlyRentalRate: number;
    totalUpfront: number;
    distance: number;
    warehouseAddress: string;
  };
  scheduledInstallationDate?: Date;
  quoteId?: Types.ObjectId;
  agreementId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const salesProcessSchema = new Schema<ISalesProcess>({
  stage: { type: String, enum: Object.values(SalesStage), required: true },
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    installAddress: { type: String, required: true },
    _id: { type: Schema.Types.ObjectId, required: false },
  },
  rampConfiguration: {
    height: { type: Number, required: false },
    components: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }],
    totalLength: { type: Number, required: false }
  },
  pricingCalculations: {
    deliveryFee: { type: Number },
    installFee: { type: Number },
    monthlyRentalRate: { type: Number },
    totalUpfront: { type: Number },
    distance: { type: Number },
    warehouseAddress: { type: String }
  },
  scheduledInstallationDate: { type: Date },
  quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
  agreementId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const SalesProcess = model<ISalesProcess>('SalesProcess', salesProcessSchema);