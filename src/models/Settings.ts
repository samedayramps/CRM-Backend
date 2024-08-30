// src/models/Settings.ts

import mongoose, { Document } from 'mongoose';

export interface IPricingVariables {
  deliveryFeePerMile: number;
  installFeePerComponent: number;
  rentalRatePerFoot: number;
}

export interface ISettings extends Document {
  pricingVariables: IPricingVariables;
}

const SettingsSchema = new mongoose.Schema({
  pricingVariables: {
    deliveryFeePerMile: { type: Number, required: true, default: 0 },
    installFeePerComponent: { type: Number, required: true, default: 0 },
    rentalRatePerFoot: { type: Number, required: true, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model<ISettings>('Settings', SettingsSchema);