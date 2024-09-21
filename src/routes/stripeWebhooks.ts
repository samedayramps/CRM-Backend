import express from 'express';
import { Quote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const router = express.Router();

router.post('/', express.raw({type: 'application/json'}), async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    return next(new CustomError(`Webhook Error: ${err.message}`, 400));
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await Quote.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { paymentStatus: 'paid', status: 'paid' }
      );
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      await Quote.findOneAndUpdate(
        { paymentIntentId: failedPaymentIntent.id },
        { paymentStatus: 'failed' }
      );
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});

export default router;