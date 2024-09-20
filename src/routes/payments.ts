import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Create a payment link
router.post('/create-link', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.body;

    // Fetch the quote
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(quote.pricingCalculations.totalAmount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { quoteId: quote.id },
    });

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: 'price_placeholder', // Replace with an actual Stripe Price ID
          quantity: 1,
        },
      ],
      after_completion: { 
        type: 'redirect', 
        redirect: { url: `${process.env.FRONTEND_URL}/payment-success?quoteId=${quote.id}` } 
      },
    });

    res.json({ paymentLink: paymentLink.url, paymentIntentId: paymentIntent.id });
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Check payment status
router.get('/status/:paymentIntentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({ 
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      quoteId: paymentIntent.metadata.quoteId
    });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;