import Stripe from 'stripe';
import { IJob } from '../models/Job';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function generateStripePaymentLink(job: IJob): Promise<string> {
  console.log('Generating payment link for job:', job._id);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ramp Rental - Upfront Payment',
          },
          unit_amount: Math.round(job.pricing.totalUpfront * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    metadata: {
      jobId: job._id.toString(),
    },
  });

  console.log('Stripe session created:', session.id);
  console.log('Payment intent created:', session.payment_intent);

  // Save the payment intent ID to the job
  job.paymentIntentId = session.payment_intent as string;
  await job.save();

  console.log('Job updated with payment intent ID:', job.paymentIntentId);
  console.log('Updated job:', JSON.stringify(job, null, 2));

  return session.url!;
}

export async function createPaymentIntent(job: IJob): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(job.pricing.totalUpfront * 100), // Convert to cents
      currency: 'usd',
      metadata: { jobId: job._id.toString() },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}