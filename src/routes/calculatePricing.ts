// src/routes/calculatePricing.ts
import { Router, Request, Response, NextFunction } from 'express';
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
  warehouseAddress: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, customerAddress, warehouseAddress } = req.body as QuoteRequest;

    if (!customerAddress || !warehouseAddress) {
      throw new CustomError('Customer address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, customerAddress, warehouseAddress);

    res.json(pricingCalculations);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;