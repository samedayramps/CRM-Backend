import { Schema, model, Document, Types } from 'mongoose';
import { SalesStage } from '../types/SalesStage';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  installAddress: string;
  mobilityAids: string[];
  rentalRequestId?: Types.ObjectId;
  quoteIds: Types.ObjectId[];
  jobIds: Types.ObjectId[];
  salesStage: SalesStage;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  installAddress: { type: String, required: true },
  mobilityAids: { type: [String], required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest' },
  quoteIds: [{ type: Schema.Types.ObjectId, ref: 'Quote' }],
  jobIds: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  salesStage: { type: String, enum: Object.values(SalesStage), default: SalesStage.CUSTOMER_CREATED },
  notes: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Update the updatedAt field on each save
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for customer's full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

export const Customer = model<ICustomer>('Customer', customerSchema);