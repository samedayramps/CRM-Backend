// src/routes/calculatePricing.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from '../services/distanceCalculation';
import { CustomError } from '../utils/CustomError';

const router = Router();

interface RampConfiguration {
  components: string[];
  totalLength: number;
}

interface QuoteRequest {
  rampConfiguration: RampConfiguration;
  customerAddress: string;
  companyAddress: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, customerAddress, companyAddress } = req.body as QuoteRequest;
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

    if (!variables) {
      throw new CustomError('Pricing variables not set', 500);
    }

    const { distance } = await calculateDistance(companyAddress, customerAddress);

    const deliveryFee = variables.baseDeliveryFee + 
      variables.deliveryFeePerMile * distance;

    const installFee = variables.baseInstallFee + 
      variables.installFeePerComponent * rampConfiguration.components.length;

    const monthlyRentalRate = variables.rentalRatePerFt * rampConfiguration.totalLength;

    const totalAmount = deliveryFee + installFee;

    const pricingCalculations = {
      deliveryFee,
      installFee,
      monthlyRentalRate,
      totalAmount,
      distance,
    };

    res.json(pricingCalculations);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;