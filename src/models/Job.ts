import { Schema, model, Document, Types } from 'mongoose';

export interface IJob extends Document {
  quoteId: Types.ObjectId;
  customerId: Types.ObjectId;
  installationDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  calendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  installationDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  address: { type: String, required: true },
  calendarEventId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Job = model<IJob>('Job', jobSchema);