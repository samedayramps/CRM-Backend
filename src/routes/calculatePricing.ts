// src/routes/calculatePricing.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from '../services/distanceCalculation';
import { CustomError } from '../utils/CustomError';
import { calculatePricing } from '../services/pricingService';

const router = Router();

interface RampConfiguration {
  components: string[];
  totalLength: number;
}

interface QuoteRequest {
  rampConfiguration: RampConfiguration;
  customerAddress: string;
  warehouseAddress: string; // Changed from companyAddress
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, customerAddress, warehouseAddress } = req.body as QuoteRequest;

    if (!customerAddress || !warehouseAddress) {
      throw new CustomError('Customer address and warehouse address are required', 400);
    }

    // Pass the correct parameters to calculatePricing
    const pricingCalculations = await calculatePricing(customerAddress, warehouseAddress);

    // If you need to use rampConfiguration, you might need to update the calculatePricing function
    // to accept this parameter as well

    res.json(pricingCalculations);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;