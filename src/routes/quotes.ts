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
import { IQuote } from '../models/Quote'; // Make sure to import IQuote

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

    // Assert the type of quote
    const typedQuote = quote as IQuote & { _id: Types.ObjectId };

    // Update quote status to 'accepted'
    typedQuote.status = 'accepted';
    await typedQuote.save();

    // Generate Stripe payment link
    const paymentLink = await generateStripePaymentLink(typedQuote);

    // Generate eSignatures.io agreement
    const esignatureService = new EsignatureService();
    let customerEmail: string;
    let customerName: string;

    if (typedQuote.customerId instanceof Types.ObjectId) {
      const customer = await Customer.findById(typedQuote.customerId);
      if (!customer) {
        throw new CustomError('Customer not found', 404);
      }
      customerEmail = customer.email;
      customerName = `${customer.firstName} ${customer.lastName}`;
    } else {
      const customer = typedQuote.customerId as ICustomer;
      customerEmail = customer.email;
      customerName = `${customer.firstName} ${customer.lastName}`;
    }

    let signatureLink: string;
    let agreementId: string;
    try {
      console.log('Sending e-signature request for quote:', typedQuote._id);
      const signatureResponse = await esignatureService.sendEsignatureRequest({
        templateId: process.env.ESIGNATURE_TEMPLATE_ID!,
        signers: [{ name: customerName, email: customerEmail }],
        metadata: JSON.stringify({ quoteId: typedQuote._id.toString() }),
        customFields: [
          { api_key: "date", value: new Date().toLocaleDateString() },
          { api_key: "customerName", value: customerName },
          { api_key: "totalLength", value: typedQuote.rampConfiguration.totalLength.toString() },
          { api_key: "number-of-landings", value: typedQuote.rampConfiguration.components.filter(c => c.type === 'landing').length.toString() },
          { api_key: "monthlyRentalRate", value: typedQuote.pricingCalculations.monthlyRentalRate.toFixed(2) },
          { api_key: "totalUpfront", value: typedQuote.pricingCalculations.totalUpfront.toFixed(2) },
          { api_key: "installAddress", value: typedQuote.installAddress },
        ],
      });
      console.log('E-signature response:', JSON.stringify(signatureResponse, null, 2));
      
      if (signatureResponse.data && signatureResponse.data.contract && signatureResponse.data.contract.id) {
        agreementId = signatureResponse.data.contract.id;
        signatureLink = signatureResponse.data.contract.signers[0].sign_page_url;
        
        // Update the quote with the agreementId
        await Quote.findByIdAndUpdate(typedQuote._id, {
          agreementId: agreementId,
          agreementStatus: 'sent'
        });
      } else {
        throw new Error('Invalid response structure from eSignatures.io');
      }
    } catch (error: any) {
      console.error('Failed to send e-signature request:', error);
      // If e-signature fails, we'll use the manual signature route
      signatureLink = `${process.env.FRONTEND_URL}/manual-signature?quoteId=${typedQuote._id}`;
    }

    // Send follow-up email with payment and signature links
    await sendFollowUpEmail(typedQuote, paymentLink, signatureLink);

    // Return JSON response
    res.json({
      message: 'Quote accepted successfully',
      quoteId: typedQuote._id,
      paymentLink,
      signatureLink
    });
  } catch (error: any) {
    console.error('Error accepting quote:', error);
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Add this new route for testing
router.get('/test-esignature', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const esignatureService = new EsignatureService();
    const response = await esignatureService.sendEsignatureRequest({
      templateId: process.env.ESIGNATURE_TEMPLATE_ID!,
      signers: [{ name: 'Test User', email: 'test@example.com' }],
      metadata: 'Test request',
      customFields: [
        { api_key: "date", value: new Date().toLocaleDateString() },
        { api_key: "customerName", value: 'Test User' },
        { api_key: "totalLength", value: '4' },
        { api_key: "number-of-landings", value: '0' },
        { api_key: "monthlyRentalRate", value: '40.00' },
        { api_key: "totalUpfront", value: '95.90' },
        { api_key: "installAddress", value: '3400 W Plano Pkwy, Plano, TX 75075, USA' },
      ],
    });
    res.json(response);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Add this new route for creating payment link
router.post('/:id/create-payment', async (req, res) => {
  const quoteId = req.params.id;
  console.log('Creating payment link for quote:', quoteId);

  const quote = await Quote.findById(quoteId);
  if (!quote) {
    console.log('Quote not found:', quoteId);
    return res.status(404).json({ error: 'Quote not found' });
  }

  try {
    const paymentLink = await generateStripePaymentLink(quote);
    console.log('Payment link generated:', paymentLink);
    res.json({ paymentLink });
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ error: 'Failed to generate payment link' });
  }
});

export default router;