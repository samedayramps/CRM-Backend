import { Schema, model, Document, Types } from 'mongoose';
import { SalesStage } from '../types/SalesStage';

export enum JobStage {
  CUSTOMER_INFO = 'CUSTOMER_INFO',
  RAMP_CONFIGURATION = 'RAMP_CONFIGURATION',
  PRICING = 'PRICING',
  QUOTE = 'QUOTE',
  INSTALLATION_SCHEDULING = 'INSTALLATION_SCHEDULING',
  COMPLETED = 'COMPLETED'
}

export interface IJob extends Document {
  stage: JobStage;
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    installAddress: string;
    mobilityAids: string[];
  };
  rampConfiguration: {
    sections: Array<{
      type: 'ramp' | 'landing';
      length: number;
      width?: number;
    }>;
    totalLength: number;
  };
  pricing: {
    deliveryFee: number;
    installFee: number;
    monthlyRate: number;
    totalUpfront: number;
  };
  quoteStatus: 'draft' | 'sent' | 'accepted' | 'declined' | 'paid';
  agreementId?: string;
  agreementStatus?: 'sent' | 'viewed' | 'signed' | 'declined';
  manualSignature?: string;
  signatureDate?: Date;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentIntentId?: string;
  scheduledInstallation?: Date;
  salesStage: SalesStage;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  stage: { type: String, enum: Object.values(JobStage), required: true },
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    installAddress: { type: String, required: true },
    mobilityAids: [{ type: String }],
  },
  rampConfiguration: {
    sections: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      width: { type: Number },
    }],
    totalLength: { type: Number, required: true },
  },
  pricing: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRate: { type: Number, required: true },
    totalUpfront: { type: Number, required: true },
  },
  quoteStatus: { type: String, enum: ['draft', 'sent', 'accepted', 'declined', 'paid'], required: true },
  agreementId: { type: String },
  agreementStatus: { type: String, enum: ['sent', 'viewed', 'signed', 'declined'] },
  manualSignature: { type: String },
  signatureDate: { type: Date },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], required: true },
  paymentIntentId: { type: String },
  scheduledInstallation: { type: Date },
  salesStage: { type: String, enum: Object.values(SalesStage), required: true },
}, { timestamps: true });

export const Job = model<IJob>('Job', jobSchema);