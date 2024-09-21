import express from 'express';
import { Quote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

router.post('/', express.json(), async (req, res, next) => {
  try {
    const { secret_token, status, data } = req.body;

    console.log('Received webhook request. Token:', secret_token);

    if (!secret_token || secret_token !== process.env.ESIGNATURES_IO_TOKEN) {
      console.log('Invalid token. Expected:', process.env.ESIGNATURES_IO_TOKEN, 'Received:', secret_token);
      return next(new CustomError('Invalid or missing token', 401));
    }

    console.log('Received eSignatures webhook event:', JSON.stringify(req.body, null, 2));

    if (!data || !data.contract || !data.contract.id) {
      console.log('Invalid event structure. Missing contract.id');
      return next(new CustomError('Invalid event structure', 400));
    }

    let updateResult;

    switch (status) {
      case 'contract-sent':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: data.contract.id },
          { agreementStatus: 'sent' },
          { new: true }
        );
        break;
      case 'contract-viewed':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: data.contract.id },
          { agreementStatus: 'viewed' },
          { new: true }
        );
        break;
      case 'contract-signed':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: data.contract.id },
          { agreementStatus: 'signed' },
          { new: true }
        );
        break;
      case 'contract-declined':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: data.contract.id },
          { agreementStatus: 'declined' },
          { new: true }
        );
        break;
      default:
        console.log(`Unhandled event type: ${status}`);
    }

    if (updateResult) {
      console.log('Quote updated:', updateResult);
    } else {
      console.log('No quote found with agreementId:', data.contract.id);
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Error processing eSignatures webhook:', error);
    next(new CustomError(error.message, 500));
  }
});

export default router;