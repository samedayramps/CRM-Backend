"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').post(authMiddleware_1.protect, customerController_1.createCustomer).get(authMiddleware_1.protect, customerController_1.getCustomers);
router.route('/:id').get(authMiddleware_1.protect, customerController_1.getCustomerById).put(authMiddleware_1.protect, customerController_1.updateCustomer).delete(authMiddleware_1.protect, customerController_1.deleteCustomer);
exports.default = router;
