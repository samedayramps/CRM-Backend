import express, { Request, Response, NextFunction } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = express.Router();

// Validation schema for registration
const registerSchema = {
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address.',
    },
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long.',
    },
  },
  name: {
    notEmpty: {
      errorMessage: 'Name is required.',
    },
  },
};

// Validation schema for login
const loginSchema = {
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address.',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required.',
    },
  },
};

// Registration route with validation
router.post('/register', checkSchema(registerSchema), (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  register(req, res, next);
});

// Login route with validation
router.post('/login', checkSchema(loginSchema), (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  login(req, res, next);
});

export default router;