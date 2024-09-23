import { Schema, model, Document, Types } from 'mongoose';

export interface IJob extends Document {
  jobId: string;
  quoteId: Types.ObjectId;
  customerId: Types.ObjectId;
  status: 'scheduled' | 'completed' | 'cancelled';
  installAddress: string;
  rampConfiguration: {
    components: Array<{
      type: 'ramp' | 'landing';
      length: number;
      quantity: number;
    }>;
    totalLength: number;
  };
  scheduledInstallationDate: Date;
  actualInstallationDate?: Date;
  calendarEventId?: string;
}

const jobSchema = new Schema<IJob>({
  jobId: { type: String, required: true, unique: true },
  quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  installAddress: { type: String, required: true },
  rampConfiguration: {
    components: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }],
    totalLength: { type: Number, required: true }
  },
  scheduledInstallationDate: { type: Date, required: true },
  actualInstallationDate: { type: Date },
  calendarEventId: { type: String }
});

export const Job = model<IJob>('Job', jobSchema);