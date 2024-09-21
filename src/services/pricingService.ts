import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from './distanceCalculation';
import { CustomError } from '../utils/CustomError';

interface RampConfiguration {
  components: string[];
  totalLength: number;
}

export async function calculatePricing(rampConfiguration: RampConfiguration, installAddress: string, warehouseAddress: string) {
  if (!installAddress || !warehouseAddress) {
    throw new CustomError('Install address and warehouse address are required', 400);
  }

  const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

  if (!variables) {
    throw new CustomError('Pricing variables not set', 500);
  }

  try {
    const { distance } = await calculateDistance(warehouseAddress, installAddress);

    const deliveryFee = variables.baseDeliveryFee + 
      variables.deliveryFeePerMile * distance;

    const installFee = variables.baseInstallFee + 
      variables.installFeePerComponent * rampConfiguration.components.length;

    const monthlyRentalRate = variables.rentalRatePerFt * rampConfiguration.totalLength;

    const totalUpfront = deliveryFee + installFee;

    return {
      deliveryFee,
      installFee,
      monthlyRentalRate,
      totalUpfront,
      distance,
      warehouseAddress,
    };
  } catch (error) {
    console.error('Error in calculatePricing:', error);
    throw error;
  }
}