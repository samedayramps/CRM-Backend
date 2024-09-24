import express from 'express';
import { SalesProcess, SalesStage } from '../../models/SalesProcess';
import { CustomError } from '../../utils/CustomError';
import { createQuoteFromCustomer } from '../../services/salesService';
import { sendQuoteEmail, sendFollowUpEmail } from '../../services/emailService';
import { generateStripePaymentLink } from '../../services/stripeService';
import { EsignatureService } from '../../services/EsignatureService';
import { RampConfiguration } from '../../models/Quote';

export const createJobRoute = () => {
  const router = express.Router();

  router.post('/:id', async (req, res, next) => {
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

      const quote = await createQuoteFromCustomer(salesProcess.customerInfo._id!, {
        rampConfiguration: salesProcess.rampConfiguration as RampConfiguration,
        pricingCalculations: salesProcess.pricingCalculations,
        installAddress: salesProcess.customerInfo.installAddress,
      });

      await sendQuoteEmail(quote);

      const paymentLink = await generateStripePaymentLink(quote);

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

  return router;
};