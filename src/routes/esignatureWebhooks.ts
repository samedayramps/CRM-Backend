import express from 'express';
import { Quote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

router.post('/', express.json(), async (req, res, next) => {
  try {
    const token = req.query.token;

    console.log('Received webhook request. Token:', token);

    if (!token || token !== process.env.ESIGNATURES_IO_TOKEN) {
      console.log('Invalid token. Expected:', process.env.ESIGNATURES_IO_TOKEN, 'Received:', token);
      return next(new CustomError('Invalid or missing token', 401));
    }

    const event = req.body;

    console.log('Received eSignatures webhook event:', JSON.stringify(event, null, 2));

    if (!event.contract || !event.contract.id) {
      console.log('Invalid event structure. Missing contract.id');
      return next(new CustomError('Invalid event structure', 400));
    }

    let updateResult;

    switch (event.event) {
      case 'contract_sent':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'sent' },
          { new: true }
        );
        break;
      case 'contract_viewed':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'viewed' },
          { new: true }
        );
        break;
      case 'contract_signed':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'signed' },
          { new: true }
        );
        break;
      case 'contract_declined':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'declined' },
          { new: true }
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    if (updateResult) {
      console.log('Quote updated:', updateResult);
    } else {
      console.log('No quote found with agreementId:', event.contract.id);
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Error processing eSignatures webhook:', error);
    next(new CustomError(error.message, 500));
  }
});

export default router;