// src/models/PricingVariables.ts
import { Schema, model, Document } from 'mongoose';

export interface IPricingVariables extends Document {
  warehouseAddress: string;
  baseDeliveryFee: number;
  deliveryFeePerMile: number;
  baseInstallFee: number;
  installFeePerComponent: number;
  rentalRatePerFt: number;
  updatedAt: Date;
}

const pricingVariablesSchema = new Schema<IPricingVariables>({
  warehouseAddress: { type: String, required: true },
  baseDeliveryFee: { type: Number, required: true },
  deliveryFeePerMile: { type: Number, required: true },
  baseInstallFee: { type: Number, required: true },
  installFeePerComponent: { type: Number, required: true },
  rentalRatePerFt: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const PricingVariables = model<IPricingVariables>('PricingVariables', pricingVariablesSchema);