// src/routes/salesProcess.ts

import express from 'express';
import { SalesProcess, SalesStage, ISalesProcess } from '../models/SalesProcess';
import { CustomError } from '../utils/CustomError';
import { createQuoteFromCustomer, createJobFromQuote } from '../services/salesService';
import { sendQuoteEmail, sendFollowUpEmail } from '../services/emailService';
import { generateStripePaymentLink } from '../services/stripeService';
import { EsignatureService } from '../services/EsignatureService';
import { RampConfiguration } from '../models/Quote'; // Import RampConfiguration type

const router = express.Router();

// Get all sales processes
router.get('/', async (req, res, next) => {
  try {
    const salesProcesses = await SalesProcess.find().sort({ createdAt: -1 });
    res.json(salesProcesses);
  } catch (error: any) {
    console.error('Error fetching sales processes:', error);
    next(new CustomError(error.message, 500));
  }
});

// Get a specific sales process
router.get('/:id', async (req, res, next) => {
  try {
    const salesProcess = await SalesProcess.findById(req.params.id);
    if (!salesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }
    res.json(salesProcess);
  } catch (error: any) {
    console.error('Error fetching sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Create a new sales process (Stage 1 - Customer Information and Install Address)
router.post('/stage1', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, installAddress } = req.body;

    if (!firstName || !lastName || !email || !phone || !installAddress) {
      throw new CustomError('Missing required fields', 400);
    }

    const salesProcess = new SalesProcess({
      stage: SalesStage.CUSTOMER_INFO,
      customerInfo: { firstName, lastName, email, phone, installAddress },
    });

    await salesProcess.save();
    res.status(201).json(salesProcess);
  } catch (error: any) {
    console.error('Error creating sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Update sales process (Stage 2 - Ramp Configuration and Pricing)
router.post('/stage2/:id', async (req, res, next) => {
  try {
    const { height, components, totalLength, pricingCalculations, scheduledInstallationDate } = req.body;

    if (!components || !totalLength || !pricingCalculations || !scheduledInstallationDate) {
      throw new CustomError('Missing required fields', 400);
    }

    const salesProcess = await SalesProcess.findById(req.params.id);
    if (!salesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }

    const rampConfiguration: RampConfiguration = {
      height,
      components,
      totalLength,
    };

    salesProcess.stage = SalesStage.RAMP_CONFIGURATION;
    salesProcess.rampConfiguration = rampConfiguration;
    salesProcess.pricingCalculations = pricingCalculations;
    salesProcess.scheduledInstallationDate = scheduledInstallationDate;

    await salesProcess.save();
    res.json(salesProcess);
  } catch (error: any) {
    console.error('Error updating sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Update sales process (Stage 3 - Send Quote and Agreement)
router.post('/stage3/:id', async (req, res, next) => {
  try {
    const salesProcess = await SalesProcess.findById(req.params.id);
    if (!salesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }

    if (!salesProcess.customerInfo) {
      throw new CustomError('Customer information is missing', 400);
    }

    if (!salesProcess.rampConfiguration || !salesProcess.pricingCalculations) {
      throw new CustomError('Ramp configuration or pricing calculations are missing', 400);
    }

    // Create quote from customer
    const quote = await createQuoteFromCustomer(salesProcess.customerInfo._id!, {
      rampConfiguration: salesProcess.rampConfiguration as RampConfiguration,
      pricingCalculations: salesProcess.pricingCalculations,
      installAddress: salesProcess.customerInfo.installAddress,
    });

    // Send quote email
    await sendQuoteEmail(quote);

    // Generate Stripe payment link
    const paymentLink = await generateStripePaymentLink(quote);

    // Generate eSignatures.io agreement
    const esignatureService = new EsignatureService();
    const signatureResponse = await esignatureService.sendEsignatureRequest({
      templateId: process.env.ESIGNATURE_TEMPLATE_ID!,
      signers: [{ name: `${salesProcess.customerInfo.firstName} ${salesProcess.customerInfo.lastName}`, email: salesProcess.customerInfo.email }],
      metadata: JSON.stringify({ quoteId: quote._id.toString() }),
      customFields: [
        { api_key: "date", value: new Date().toLocaleDateString() },
        { api_key: "customerName", value: `${salesProcess.customerInfo.firstName} ${salesProcess.customerInfo.lastName}` },
        { api_key: "totalLength", value: quote.rampConfiguration.totalLength.toString() },
        { api_key: "number-of-landings", value: quote.rampConfiguration.components.filter(c => c.type === 'landing').length.toString() },
        { api_key: "monthlyRentalRate", value: quote.pricingCalculations.monthlyRentalRate.toFixed(2) },
        { api_key: "totalUpfront", value: quote.pricingCalculations.totalUpfront.toFixed(2) },
        { api_key: "installAddress", value: quote.installAddress },
      ],
    });

    if (signatureResponse.data && signatureResponse.data.contract && signatureResponse.data.contract.id) {
      quote.agreementId = signatureResponse.data.contract.id;
      quote.agreementStatus = 'sent';
      await quote.save();
    }

    // Send follow-up email
    const signatureLink = signatureResponse.data.contract.signers[0].sign_page_url;
    await sendFollowUpEmail(quote, paymentLink, signatureLink);

    salesProcess.stage = SalesStage.QUOTE_SENT;
    salesProcess.quoteId = quote._id;
    salesProcess.agreementId = quote.agreementId;

    await salesProcess.save();
    res.json(salesProcess);
  } catch (error: any) {
    console.error('Error updating sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Update a sales process
router.put('/:id', async (req, res, next) => {
  try {
    const updatedSalesProcess = await SalesProcess.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSalesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }
    res.json(updatedSalesProcess);
  } catch (error: any) {
    console.error('Error updating sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Delete a sales process
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedSalesProcess = await SalesProcess.findByIdAndDelete(req.params.id);
    if (!deletedSalesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

export default router;