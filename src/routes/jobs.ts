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
  try {
    const rentalRequest = await RentalRequest.findById(req.params.rentalRequestId);
    if (!rentalRequest) {
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
    res.status(201).json(job);
  } catch (error: any) {
    console.error('Error creating job from rental request:', error);
    next(new CustomError(error.message, 500));
  }
});

router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    next(new CustomError(error.message, 500));
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return next(new CustomError('Job not found', 404));
    }
    res.json(job);
  } catch (error: any) {
    console.error('Error fetching job:', error);
    next(new CustomError(error.message, 500));
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return next(new CustomError('Job not found', 404));
    }
    res.json(updatedJob);
  } catch (error: any) {
    console.error('Error updating job:', error);
    next(new CustomError(error.message, 500));
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return next(new CustomError('Job not found', 404));
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting job:', error);
    next(new CustomError(error.message, 500));
  }
});

// Calculate Pricing route
router.post('/calculate-pricing', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, installAddress, warehouseAddress } = req.body;

    if (!installAddress || !warehouseAddress) {
      throw new CustomError('Install address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, installAddress, warehouseAddress);

    res.json(pricingCalculations);
  } catch (error: any) {
    console.error('Error in calculatePricing route:', error);
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// E-signature routes
router.post('/esignatures/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await esignatureService.sendEsignatureRequest(req.body);
    res.json(result);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.get('/esignatures/status/:contractId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contractId } = req.params;
    const status = await esignatureService.checkEsignatureStatus(contractId);
    res.json(status);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// E-signature webhook route
router.post('/esignatures/webhook', express.json(), async (req, res, next) => {
  try {
    const { secret_token, status, data } = req.body;

    if (!secret_token || secret_token !== process.env.ESIGNATURES_IO_TOKEN) {
      return next(new CustomError('Invalid or missing token', 401));
    }

    if (!data || !data.contract || !data.contract.id) {
      return next(new CustomError('Invalid event structure', 400));
    }

    let updateResult;

    switch (status) {
      case 'contract-sent':
      case 'contract-viewed':
      case 'contract-signed':
      case 'contract-declined':
        updateResult = await Job.findOneAndUpdate(
          { agreementId: data.contract.id },
          { agreementStatus: status.replace('contract-', '') },
          { new: true }
        );

        if (!updateResult && data.contract.metadata) {
          const metadata = JSON.parse(data.contract.metadata);
          if (metadata.jobId) {
            updateResult = await Job.findByIdAndUpdate(
              metadata.jobId,
              { 
                agreementId: data.contract.id,
                agreementStatus: status.replace('contract-', '')
              },
              { new: true }
            );
          }
        }
        break;
      default:
        console.log(`Unhandled event type: ${status}`);
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Error processing eSignatures webhook:', error);
    next(new CustomError(error.message, 500));
  }
});

// Pricing Variables routes
router.get('/pricing-variables', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    if (!variables) {
      return res.status(404).json({ message: 'Pricing variables not found. Please set initial values.' });
    }
    res.json(variables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.post('/pricing-variables', pricingVariablesRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const pricingVariables = new PricingVariables(req.body);
    await pricingVariables.save();
    res.status(201).json(pricingVariables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.put('/pricing-variables', pricingVariablesRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    if (!variables) {
      return next(new CustomError('Pricing variables not found', 404));
    }

    const updatedVariables = await PricingVariables.findByIdAndUpdate(
      variables._id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json(updatedVariables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Manual Signature routes
router.get('/manual-signature/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }
    
    res.send(`
      <h1>Manual Signature Required</h1>
      <p>Please sign below to accept the job:</p>
      <form action="/api/jobs/manual-signature/${jobId}" method="POST">
        <input type="text" name="signature" placeholder="Type your full name" required>
        <button type="submit">Sign and Accept</button>
      </form>
    `);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

router.post('/manual-signature/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const { signature } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }
    
    const updatedJob: Partial<IJob> = {
      manualSignature: signature,
      signatureDate: new Date()
    };
    
    await Job.findByIdAndUpdate(jobId, updatedJob);
    
    res.redirect(`${process.env.FRONTEND_URL}/job-accepted?id=${jobId}`);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Stripe Webhook route
router.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      // Add other cases as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Error processing webhook');
  }

  res.json({ received: true });
});

// Rental Requests routes
router.get('/rental-requests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentalRequests = await RentalRequest.find().sort({ createdAt: -1 });
    res.json(rentalRequests);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.post('/rental-requests', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
    next(new CustomError(error.message, 500));
  }
});

// Helper functions for Stripe webhook handling
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent was successful!', paymentIntent.id);
  
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
  console.log('PaymentIntent failed!', paymentIntent.id);
  await Job.findOneAndUpdate(
    { paymentIntentId: paymentIntent.id },
    { paymentStatus: 'failed' }
  );
}

export default router;