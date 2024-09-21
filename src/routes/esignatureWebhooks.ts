import express from 'express';
import { Quote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

router.post('/', express.json(), async (req, res, next) => {
  try {
    const token = req.query.token;

    if (!token || token !== process.env.ESIGNATURES_IO_TOKEN) {
      return next(new CustomError('Invalid or missing token', 401));
    }

    const event = req.body;

    console.log('Received eSignatures webhook event:', JSON.stringify(event, null, 2));

    switch (event.event) {
      case 'contract_sent':
        await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'sent' }
        );
        break;
      case 'contract_viewed':
        await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'viewed' }
        );
        break;
      case 'contract_signed':
        await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'signed' }
        );
        break;
      case 'contract_declined':
        await Quote.findOneAndUpdate(
          { agreementId: event.contract.id },
          { agreementStatus: 'declined' }
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Error processing eSignatures webhook:', error);
    next(new CustomError(error.message, 500));
  }
});

export default router;