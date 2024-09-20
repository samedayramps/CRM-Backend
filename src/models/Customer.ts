// src/models/Customer.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  installAddress: string;
  mobilityAids: string[];
  rentalRequestId?: Types.ObjectId;
  notes?: string; // New field for additional customer information
  preferredContactMethod?: string; // New field for communication preference
  createdAt: Date;
  updatedAt: Date; // New field to track last update
}

const customerSchema = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  installAddress: { type: String, required: true },
  mobilityAids: { type: [String], required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  notes: { type: String, required: false },
  preferredContactMethod: { type: String, enum: ['email', 'phone', 'text'], required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

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