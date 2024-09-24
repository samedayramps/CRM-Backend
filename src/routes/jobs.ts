import express, { Request, Response, NextFunction } from 'express';
import { Job, JobStage, IJob } from '../models/Job';
import { PricingVariables } from '../models/PricingVariables';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { CustomError } from '../utils/CustomError';
import { validationResult } from 'express-validator';
import { pricingVariablesRules, rentalRequestRules } from '../utils/validationRules';
import { sendRentalRequestNotification } from '../utils/emailNotification';
import { sendPushNotification } from '../utils/pushNotification';
import { calculatePricing } from '../services/pricingService';
import { EsignatureService } from '../services/EsignatureService';
import Stripe from 'stripe';

const router = express.Router();
const esignatureService = new EsignatureService();

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Job routes
router.post('/from-rental-request/:rentalRequestId', async (req, res, next) => {
  console.log(`Creating job from rental request: ${req.params.rentalRequestId}`);
  try {
    const rentalRequest = await RentalRequest.findById(req.params.rentalRequestId);
    if (!rentalRequest) {
      console.log(`Rental request not found: ${req.params.rentalRequestId}`);
      return next(new CustomError('Rental request not found', 404));
    }

    const job = new Job({
      stage: JobStage.CUSTOMER_INFO,
      customerInfo: {
        firstName: rentalRequest.customerInfo.firstName,
        lastName: rentalRequest.customerInfo.lastName,
        phone: rentalRequest.customerInfo.phone,
        email: rentalRequest.customerInfo.email,
        installAddress: rentalRequest.installAddress,
        mobilityAids: rentalRequest.rampDetails.mobilityAids,
      },
    });

    await job.save();
    console.log(`Job created successfully: ${job._id}`);
    res.status(201).json(job);
  } catch (error: any) {
    console.error('Error creating job from rental request:', error);
    next(new CustomError(error.message, 500));
  }
});

// Calculate Pricing route
router.post('/calculate-pricing', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Calculating pricing with input:', JSON.stringify(req.body));
  try {
    const { rampConfiguration, installAddress, warehouseAddress } = req.body;

    if (!installAddress || !warehouseAddress) {
      console.log('Missing required fields for pricing calculation');
      throw new CustomError('Install address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, installAddress, warehouseAddress);
    console.log('Pricing calculation result:', JSON.stringify(pricingCalculations));

    res.json(pricingCalculations);
  } catch (error: any) {
    console.error('Error in calculatePricing route:', error);
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// E-signature routes
router.post('/esignatures/send', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Sending e-signature request:', JSON.stringify(req.body));
  try {
    const result = await esignatureService.sendEsignatureRequest(req.body);
    console.log('E-signature request sent successfully:', JSON.stringify(result));
    res.json(result);
  } catch (error: any) {
    console.error('Error sending e-signature request:', error);
    next(new CustomError(error.message, 500));
  }
});

router.get('/esignatures/status/:contractId', async (req: Request, res: Response, next: NextFunction) => {
  console.log(`Checking e-signature status for contract: ${req.params.contractId}`);
  try {
    const { contractId } = req.params;
    const status = await esignatureService.checkEsignatureStatus(contractId);
    console.log(`E-signature status for contract ${contractId}:`, JSON.stringify(status));
    res.json(status);
  } catch (error: any) {
    console.error('Error checking e-signature status:', error);
    next(new CustomError(error.message, 500));
  }
});

// Stripe Webhook route
router.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  console.log('Received Stripe webhook');
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Stripe event constructed:', event.type);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Processing payment_intent.succeeded');
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        console.log('Processing payment_intent.payment_failed');
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Error processing webhook');
  }

  console.log('Webhook processed successfully');
  res.json({ received: true });
});

// Rental Requests routes
router.get('/rental-requests', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Fetching all rental requests');
  try {
    const rentalRequests = await RentalRequest.find().sort({ createdAt: -1 });
    console.log(`Found ${rentalRequests.length} rental requests`);
    res.json(rentalRequests);
  } catch (error: any) {
    console.error('Error fetching rental requests:', error);
    next(new CustomError(error.message, 500));
  }
});

router.post('/rental-requests', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  console.log('Creating new rental request:', JSON.stringify(req.body));
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerInfo, rampDetails, installAddress } = req.body;

    const rentalRequest = new RentalRequest({
      customerInfo,
      rampDetails,
      installAddress,
      status: 'pending'
    });

    await rentalRequest.save();
    console.log('Rental request created successfully:', rentalRequest._id);

    // Send email notification
    sendRentalRequestNotification(rentalRequest).catch((error: any) => {
      console.error('Failed to send email notification:', error);
    });

    // Send push notification
    const pushMessage = `New rental request from ${customerInfo.firstName} ${customerInfo.lastName}`;
    sendPushNotification('New Rental Request', pushMessage.trim()).catch((error: any) => {
      console.error('Failed to send push notification:', error);
    });

    res.status(201).json(rentalRequest);
  } catch (error: any) {
    console.error('Error creating rental request:', error);
    next(new CustomError(error.message, 500));
  }
});

// Helper functions for Stripe webhook handling
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment intent:', paymentIntent.id);
  
  let job = await Job.findOne({ paymentIntentId: paymentIntent.id });
  
  if (!job && paymentIntent.metadata && paymentIntent.metadata.jobId) {
    job = await Job.findById(paymentIntent.metadata.jobId);
  }
  
  if (!job) {
    console.error('Job not found for paymentIntentId:', paymentIntent.id);
    return;
  }
  
  job.paymentStatus = 'paid';
  job.stage = JobStage.COMPLETED;
  job.paymentIntentId = paymentIntent.id;
  await job.save();
  
  console.log('Job updated successfully:', job._id);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment intent:', paymentIntent.id);
  
  let job = await Job.findOne({ paymentIntentId: paymentIntent.id });
  
  if (!job && paymentIntent.metadata && paymentIntent.metadata.jobId) {
    job = await Job.findById(paymentIntent.metadata.jobId);
  }
  
  if (!job) {
    console.error('Job not found for paymentIntentId:', paymentIntent.id);
    return;
  }
  
  job.paymentStatus = 'failed';
  await job.save();
  
  console.log('Job updated with failed payment status:', job._id);
}

export default router;