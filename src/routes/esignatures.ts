import express, { Request, Response, NextFunction } from 'express';
import { EsignatureService } from '../services/EsignatureService';
import { body, validationResult } from 'express-validator';
import { CustomError } from '../utils/CustomError';

const router = express.Router();
const esignatureService = new EsignatureService();

// Validation middleware for send request
const validateSendRequest = [
  body('templateId').isString().notEmpty(),
  body('signers').isArray().notEmpty(),
  body('signers.*.name').isString().notEmpty(),
  body('signers.*.email').isEmail(),
  body('metadata').optional().isString(),
  body('placeholderFields').optional().isArray(),
  body('placeholderFields.*.api_key').optional().isString(),
  body('placeholderFields.*.value').optional().isString(),
];

router.post('/send', validateSendRequest, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const result = await esignatureService.sendEsignatureRequest(req.body);
    res.json(result);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.get('/status/:contractId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contractId } = req.params;
    const status = await esignatureService.checkEsignatureStatus(contractId);
    res.json(status);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;