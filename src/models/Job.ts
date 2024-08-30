import mongoose, { Document } from 'mongoose';

export interface IRampComponent {
  _id?: mongoose.Types.ObjectId;
  type: 'RS4' | 'RS5' | 'RS6' | 'RS7' | 'RS8' | 'L55' | 'L45' | 'L85';
  quantity: number;
}

export interface IJob extends Document {
  customer: mongoose.Types.ObjectId;
  installAddress: string;
  status: 'New' | 'Quoted' | 'Scheduled' | 'Installed' | 'Completed';
  totalCost: number;
  deliveryFee: number;
  installFee: number;
  rentalRate: number;
  overridePricing: boolean;
  scheduledDate: Date;
  notes: string;
  components: IRampComponent[];
  totalRampLength: number;
  totalLandings: number;
  distanceFromWarehouse: number;
}

const RampComponentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['RS4', 'RS5', 'RS6', 'RS7', 'RS8', 'L55', 'L45', 'L85'],
    required: true 
  },
  quantity: { type: Number, required: true, min: 1 }
});

const JobSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  installAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Quoted', 'Scheduled', 'Installed', 'Completed'],
    required: true, 
    default: 'New' 
  },
  totalCost: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  installFee: { type: Number, required: true },
  rentalRate: { type: Number, required: true },
  overridePricing: { type: Boolean, default: false },
  scheduledDate: { type: Date },
  notes: { type: String },
  components: [RampComponentSchema],
  totalRampLength: { type: Number, default: 0 },
  totalLandings: { type: Number, default: 0 },
  distanceFromWarehouse: { type: Number, default: 0 }
}, { timestamps: true });

JobSchema.pre<IJob>('save', function(next) {
  let rampLength = 0;
  let landings = 0;

  this.components.forEach(component => {
    if (component.type.startsWith('RS')) {
      rampLength += parseInt(component.type.slice(2)) * component.quantity;
    } else if (component.type.startsWith('L')) {
      landings += component.quantity;
    }
  });

  this.totalRampLength = rampLength;
  this.totalLandings = landings;

  next();
});

export default mongoose.model<IJob>('Job', JobSchema);