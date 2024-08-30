"use strict";
// src/routes/settingsRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/pricing')
    .get(authMiddleware_1.protect, settingsController_1.getPricingVariables)
    .put(authMiddleware_1.protect, settingsController_1.updatePricingVariables);
exports.default = router;
