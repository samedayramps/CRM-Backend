import express, { Request, Response, NextFunction } from 'express';
import { Quote } from '../models/Quote';
import { Customer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';
import { validationResult } from 'express-validator';
import { quoteRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { calculatePricing } from '../services/pricingService';

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
    const quote = await Quote.findById(req.params.id)
      .populate('customerId')
      .populate('rentalRequestId');
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    res.json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a new quote
router.post('/', quoteRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const { customerId, rentalRequestId, rampConfiguration } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new CustomError('Customer not found', 404);
    }

    if (rentalRequestId) {
      const rentalRequest = await RentalRequest.findById(rentalRequestId);
      if (!rentalRequest) {
        throw new CustomError('Rental request not found', 404);
      }
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, customer.installAddress);

    const quoteData = {
      customerId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      rentalRequestId,
      rampConfiguration,
      pricingCalculations,
    };

    const quote = new Quote(quoteData);
    await quote.save();

    res.status(201).json(quote);
  } catch (error: any) {
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