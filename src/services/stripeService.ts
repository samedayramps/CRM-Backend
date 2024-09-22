import Stripe from 'stripe';
import { IQuote } from '../models/Quote';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function generateStripePaymentLink(quote: IQuote): Promise<string> {
  console.log('Generating payment link for quote:', quote._id);
  
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

  console.log('Stripe session created:', session.id);
  console.log('Payment intent created:', session.payment_intent);

  // Save the payment intent ID to the quote
  quote.paymentIntentId = session.payment_intent as string;
  await quote.save();

  console.log('Quote updated with payment intent ID:', quote.paymentIntentId);
  console.log('Updated quote:', JSON.stringify(quote, null, 2));

  return session.url!;
}