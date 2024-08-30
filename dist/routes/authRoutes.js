"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_validator_1 = __importDefault(require("express-validator"));
const { body, validationResult } = express_validator_1.default;
const router = express_1.default.Router();
// Validation middleware for registration
const validateRegister = [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    body('name').not().isEmpty().withMessage('Name is required.'),
];
// Validation middleware for login
const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').not().isEmpty().withMessage('Password is required.'),
];
// Registration route with validation
router.post('/register', validateRegister, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    (0, authController_1.register)(req, res, next);
});
// Login route with validation
router.post('/login', validateLogin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    (0, authController_1.login)(req, res, next);
});
exports.default = router;
