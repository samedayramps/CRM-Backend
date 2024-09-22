import express from 'express';
import { Quote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';
import Stripe from 'stripe';
import bodyParser from 'body-parser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const router = express.Router();

// Apply the raw body parser specifically for this route
router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }), // Raw body required for Stripe
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      // Stripe expects the raw body as a Buffer for signature verification
      event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err: any) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Received event:', event.type);

    // Handle the event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('PaymentIntent was successful!', paymentIntent.id);
          await Quote.findOneAndUpdate(
            { paymentIntentId: paymentIntent.id },
            { paymentStatus: 'paid', status: 'paid' }
          );
          break;
        // ... other cases ...
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).send('Error processing webhook');
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

export default router;