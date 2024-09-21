import express, { Request, Response, NextFunction } from 'express';
import { Quote } from '../models/Quote';
import { calculatePricing } from '../services/pricingService';
import { validationResult } from 'express-validator';
import { quoteRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { Types } from 'mongoose';

const router = express.Router();

// Get all quotes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotes = await Quote.find()
      .populate('customerId')
      .populate('rentalRequestId')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Get a specific quote
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid quote ID', 400));
    }

    const quote = await Quote.findById(id)
      .populate('customerId')
      .populate('rentalRequestId');
    if (!quote) {
      return next(new CustomError('Quote not found', 404));
    }
    res.json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a new quote
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, installAddress, warehouseAddress } = req.body;
    console.log('Quote request body:', req.body); // Add this line for debugging

    if (!installAddress || !warehouseAddress) {
      throw new CustomError('Install address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, installAddress, warehouseAddress);

    const quoteData = {
      ...req.body,
      pricingCalculations
    };

    const quote = new Quote(quoteData);
    await quote.save();
    res.status(201).json(quote);
  } catch (error: any) {
    console.error('Error creating quote:', error); // Add this line for debugging
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Update a quote
router.put('/:id', quoteRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const { rampConfiguration, pricingCalculations } = req.body;
    // Ensure totalUpfront is set correctly in pricingCalculations
    pricingCalculations.totalUpfront = pricingCalculations.deliveryFee + pricingCalculations.installFee;
    
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { rampConfiguration, pricingCalculations },
      { new: true, runValidators: true }
    );

    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    res.json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Delete a quote
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    res.json({ message: 'Quote deleted successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Add this route to your quotes.ts file
router.post('/:id/send-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    // Implement your email sending logic here
    // You might want to use a service like nodemailer or a third-party email API
    // await sendEmail(quote);
    res.json({ message: 'Quote email sent successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;