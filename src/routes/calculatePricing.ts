// src/routes/calculatePricing.ts
import { Router, Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';
import { calculatePricing } from '../services/pricingService';

const router = Router();

interface RampComponent {
  type: 'ramp' | 'landing';
  length: number;
  quantity: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

interface QuoteRequest {
  rampConfiguration: RampConfiguration;
  installAddress: string;  // Changed from customerAddress
  warehouseAddress: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, installAddress, warehouseAddress } = req.body as QuoteRequest;

    if (!installAddress || !warehouseAddress) {
      throw new CustomError('Install address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, installAddress, warehouseAddress);

    res.json(pricingCalculations);
  } catch (error: any) {
    console.error('Error in calculatePricing route:', error);  // Add this line for debugging
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;