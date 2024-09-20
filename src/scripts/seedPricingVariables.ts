import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PricingVariables } from '../models/PricingVariables';

dotenv.config();

const seedPricingVariables = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const initialPricingVariables = {
      warehouseAddress: '123 Warehouse St, City, State, ZIP',
      baseDeliveryFee: 50,
      deliveryFeePerMile: 2,
      baseInstallFee: 100,
      installFeePerComponent: 25,
      rentalRatePerFt: 5,
    };

    const existingVariables = await PricingVariables.findOne();
    if (existingVariables) {
      console.log('Pricing variables already exist. Updating...');
      await PricingVariables.findByIdAndUpdate(existingVariables._id, initialPricingVariables);
    } else {
      console.log('Creating new pricing variables...');
      await PricingVariables.create(initialPricingVariables);
    }

    console.log('Pricing variables seeded successfully');
  } catch (error) {
    console.error('Error seeding pricing variables:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedPricingVariables();