import express, { Request, Response, NextFunction } from 'express';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

router.get('/:quoteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.params;
    const quote = await Quote.findById(quoteId).populate('customerId');
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    
    // Render a simple form for manual signature
    res.send(`
      <h1>Manual Signature Required</h1>
      <p>Please sign below to accept the quote:</p>
      <form action="/api/manual-signature/${quoteId}" method="POST">
        <input type="text" name="signature" placeholder="Type your full name" required>
        <button type="submit">Sign and Accept</button>
      </form>
    `);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

router.post('/:quoteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.params;
    const { signature } = req.body;
    
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    
    // Update quote with manual signature
    const updatedQuote: Partial<IQuote> = {
      manualSignature: signature,
      signatureDate: new Date()
    };
    
    await Quote.findByIdAndUpdate(quoteId, updatedQuote);
    
    res.redirect(`${process.env.FRONTEND_URL}/quote-accepted?id=${quoteId}`);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;