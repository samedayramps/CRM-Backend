import express, { Request, Response, NextFunction } from 'express';
import { Quote } from '../models/Quote';
import { Customer, ICustomer } from '../models/Customer'; // Add this line
import { calculatePricing } from '../services/pricingService';
import { validationResult } from 'express-validator';
import { quoteRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { Types } from 'mongoose';
import { sendQuoteEmail, sendFollowUpEmail } from '../services/emailService';
import { verifyAcceptanceToken } from '../utils/tokenUtils';
import { generateStripePaymentLink } from '../services/stripeService';
import { EsignatureService } from '../services/EsignatureService';

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

// Send quote email
router.post('/:id/send-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid quote ID', 400));
    }

    const quote = await Quote.findById(id).populate('customerId');
    if (!quote) {
      return next(new CustomError('Quote not found', 404));
    }

    await sendQuoteEmail(quote);

    // Update quote status to 'sent'
    quote.status = 'sent';
    await quote.save();

    res.json({ message: 'Quote email sent successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Accept quote
router.get('/:id/accept', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid quote ID', 400));
    }

    if (!token || typeof token !== 'string') {
      return next(new CustomError('Invalid or missing acceptance token', 400));
    }

    // Verify the acceptance token
    const isValidToken = verifyAcceptanceToken(id, token);
    if (!isValidToken) {
      return next(new CustomError('Invalid or expired acceptance token', 401));
    }

    const quote = await Quote.findById(id).populate('customerId');
    if (!quote) {
      return next(new CustomError('Quote not found', 404));
    }

    // Update quote status to 'accepted'
    quote.status = 'accepted';
    await quote.save();

    // Generate Stripe payment link
    const paymentLink = await generateStripePaymentLink(quote);

    // Generate eSignatures.io agreement
    const esignatureService = new EsignatureService();
    let customerEmail: string;
    let customerName: string;

    if (quote.customerId instanceof Types.ObjectId) {
      const customer = await Customer.findById(quote.customerId);
      if (!customer) {
        throw new CustomError('Customer not found', 404);
      }
      customerEmail = customer.email;
      customerName = `${customer.firstName} ${customer.lastName}`;
    } else {
      const customer = quote.customerId as ICustomer;
      customerEmail = customer.email;
      customerName = `${customer.firstName} ${customer.lastName}`;
    }

    let signatureLink: string;
    try {
      const signatureResponse = await esignatureService.sendEsignatureRequest({
        templateId: process.env.ESIGNATURE_TEMPLATE_ID!, // Make sure this is set in your .env file
        signers: [{ name: customerName, email: customerEmail }],
        metadata: `Quote ID: ${quote._id}`,
      });
      signatureLink = signatureResponse.signing_link;
    } catch (error: any) {
      console.error('Failed to send e-signature request:', error);
      // If e-signature fails, we'll still continue with the process
      signatureLink = `${process.env.FRONTEND_URL}/manual-signature?quoteId=${quote._id}`;
    }

    // Send follow-up email with payment and signature links
    await sendFollowUpEmail(quote, paymentLink, signatureLink);

    // Redirect to a success page or send a success response
    res.redirect(`${process.env.FRONTEND_URL}/quote-accepted?id=${quote._id}&paymentLink=${encodeURIComponent(paymentLink)}&signatureLink=${encodeURIComponent(signatureLink)}`);
  } catch (error: any) {
    console.error('Error accepting quote:', error);
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;