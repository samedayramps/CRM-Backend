import { Schema, model, Document, Types } from 'mongoose';

export interface IJob extends Document {
  quoteId: Types.ObjectId;
  customerId: Types.ObjectId;
  installationDate: Date;
  address: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  calendarEventId?: string;
}

const jobSchema = new Schema<IJob>({
  quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  installationDate: { type: Date, required: true },
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  calendarEventId: { type: String }
});

export const Job = model<IJob>('Job', jobSchema);