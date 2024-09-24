// src/models/SalesProcess.ts

import { Schema, model, Document, Types } from 'mongoose';

export enum SalesStage {
  RENTAL_REQUEST_RECEIVED = 'RENTAL_REQUEST_RECEIVED',
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  QUOTE_DRAFT = 'QUOTE_DRAFT',
  QUOTE_SENT = 'QUOTE_SENT',
  QUOTE_ACCEPTED = 'QUOTE_ACCEPTED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  JOB_CREATED = 'JOB_CREATED',
  JOB_SCHEDULED = 'JOB_SCHEDULED',
  JOB_COMPLETED = 'JOB_COMPLETED'
}

export interface ISalesProcess extends Document {
  stage: SalesStage;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    installAddress: string;
    mobilityAids: string[];
  };
  rentalRequest: {
    knowRampLength: boolean;
    rampLength?: number;
    knowRentalDuration: boolean;
    rentalDuration?: number;
    installTimeframe: string;
  };
  quote?: {
    rampConfiguration: {
      components: Array<{
        type: 'ramp' | 'landing';
        length: number;
        quantity: number;
      }>;
      totalLength: number;
    };
    pricingCalculations: {
      deliveryFee: number;
      installFee: number;
      monthlyRentalRate: number;
      totalUpfront: number;
      distance: number;
      warehouseAddress: string;
    };
    status: 'draft' | 'sent' | 'accepted' | 'paid';
    paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
    paymentIntentId?: string;
    agreementStatus: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
    agreementId?: string;
  };
  job?: {
    scheduledInstallationDate?: Date;
    actualInstallationDate?: Date;
    calendarEventId?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  };
  notes?: string;
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
    mobilityAids: { type: [String], required: true },
  },
  rentalRequest: {
    knowRampLength: { type: Boolean, required: true },
    rampLength: { type: Number },
    knowRentalDuration: { type: Boolean, required: true },
    rentalDuration: { type: Number },
    installTimeframe: { type: String, required: true },
  },
  quote: {
    rampConfiguration: {
      components: [{
        type: { type: String, enum: ['ramp', 'landing'], required: true },
        length: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }],
      totalLength: { type: Number, required: true }
    },
    pricingCalculations: {
      deliveryFee: { type: Number },
      installFee: { type: Number },
      monthlyRentalRate: { type: Number },
      totalUpfront: { type: Number },
      distance: { type: Number },
      warehouseAddress: { type: String }
    },
    status: { type: String, enum: ['draft', 'sent', 'accepted', 'paid'] },
    paymentStatus: { type: String, enum: ['pending', 'processing', 'paid', 'failed'] },
    paymentIntentId: { type: String },
    agreementStatus: { type: String, enum: ['pending', 'sent', 'viewed', 'signed', 'declined'] },
    agreementId: { type: String }
  },
  job: {
    scheduledInstallationDate: { type: Date },
    actualInstallationDate: { type: Date },
    calendarEventId: { type: String },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'] }
  },
  notes: { type: String },
}, { timestamps: true });

export const SalesProcess = model<ISalesProcess>('SalesProcess', salesProcessSchema);