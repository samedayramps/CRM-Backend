// src/routes/stripeWebhooks.ts
import express from 'express';
import { Quote } from '../models/Quote';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const router = express.Router();

// No need for bodyParser.raw() here since it's applied in app.ts
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook payload:', JSON.stringify(event, null, 2));

  console.log('Received event:', event.type);

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        
        // Find the quote by paymentIntentId or quoteId from metadata
        let quote = await Quote.findOne({ paymentIntentId: paymentIntent.id });
        
        if (!quote && paymentIntent.metadata && paymentIntent.metadata.quoteId) {
          quote = await Quote.findById(paymentIntent.metadata.quoteId);
        }
        
        if (!quote) {
          console.error('Quote not found for paymentIntentId:', paymentIntent.id);
          console.error('Metadata:', JSON.stringify(paymentIntent.metadata, null, 2));
          return res.status(404).send('Quote not found');
        }
        
        // Update quote status
        quote.paymentStatus = 'paid';
        quote.status = 'paid';
        quote.paymentIntentId = paymentIntent.id; // Ensure this is set
        await quote.save();
        
        console.log('Quote updated successfully:', quote._id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed!', failedPaymentIntent.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: failedPaymentIntent.id },
          { paymentStatus: 'failed' }
        );
        break;
      }
      case 'payment_intent.canceled': {
        const canceledPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent canceled!', canceledPaymentIntent.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: canceledPaymentIntent.id },
          { paymentStatus: 'canceled', status: 'canceled' }
        );
        break;
      }
      case 'payment_intent.requires_action': {
        const requiresActionIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent requires action!', requiresActionIntent.id);
        // Handle any additional steps required
        break;
      }
      case 'charge.succeeded': {
        const chargeSucceeded = event.data.object as Stripe.Charge;
        console.log('Charge succeeded!', chargeSucceeded.id);
        // Optionally update the Quote or perform other actions
        break;
      }
      case 'charge.failed': {
        const chargeFailed = event.data.object as Stripe.Charge;
        console.log('Charge failed!', chargeFailed.id);
        // Optionally update the Quote or perform other actions
        break;
      }
      case 'charge.refunded': {
        const chargeRefunded = event.data.object as Stripe.Charge;
        console.log('Charge refunded!', chargeRefunded.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: chargeRefunded.payment_intent as string },
          { paymentStatus: 'refunded', status: 'refunded' }
        );
        break;
      }
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log('Charge dispute created!', dispute.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: dispute.payment_intent as string },
          { paymentStatus: 'disputed', status: 'disputed' }
        );
        break;
      }
      case 'invoice.finalized': {
        const invoiceFinalized = event.data.object as Stripe.Invoice;
        console.log('Invoice finalized!', invoiceFinalized.id);
        // Optionally handle invoice finalization
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoicePaymentSucceeded = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded!', invoicePaymentSucceeded.id);
        // Optionally handle successful invoice payment
        break;
      }
      case 'invoice.payment_failed': {
        const invoicePaymentFailed = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed!', invoicePaymentFailed.id);
        // Optionally handle failed invoice payment
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Error processing webhook');
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;