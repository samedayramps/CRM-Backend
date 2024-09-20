import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from './distanceCalculation';
import { CustomError } from '../utils/CustomError';

interface RampConfiguration {
  components: string[];
  totalLength: number;
}

export async function calculatePricing(rampConfiguration: RampConfiguration, customerAddress: string) {
  const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

  if (!variables) {
    throw new CustomError('Pricing variables not set', 500);
  }

  const companyAddress = process.env.COMPANY_ADDRESS;
  if (!companyAddress) {
    throw new CustomError('Company address not set', 500);
  }

  const { distance } = await calculateDistance(companyAddress, customerAddress);

  const deliveryFee = variables.baseDeliveryFee + 
    variables.deliveryFeePerMile * distance;

  const installFee = variables.baseInstallFee + 
    variables.installFeePerComponent * rampConfiguration.components.length;

  const monthlyRentalRate = variables.rentalRatePerFt * rampConfiguration.totalLength;

  const totalAmount = deliveryFee + installFee;

  return {
    deliveryFee,
    installFee,
    monthlyRentalRate,
    totalAmount,
    distance,
  };
}