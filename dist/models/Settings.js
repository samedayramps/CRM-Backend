"use strict";
// src/models/Settings.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SettingsSchema = new mongoose_1.default.Schema({
    pricingVariables: {
        deliveryFeePerMile: { type: Number, required: true, default: 0 },
        installFeePerComponent: { type: Number, required: true, default: 0 },
        rentalRatePerFoot: { type: Number, required: true, default: 0 },
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Settings', SettingsSchema);
