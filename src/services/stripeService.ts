import Stripe from 'stripe';
import { IQuote } from '../models/Quote';
import { logger } from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function generateStripePaymentLink(quote: IQuote): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ramp Rental - Upfront Payment',
          },
          unit_amount: Math.round(quote.pricingCalculations.totalUpfront * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    metadata: {
      quoteId: quote._id.toString(),
    },
  });

  // Save the payment intent ID to the quote
  quote.paymentIntentId = session.payment_intent as string;
  await quote.save();

  logger.info(`Payment intent ${quote.paymentIntentId} created for quote ${quote._id}`);

  return session.url!;
}