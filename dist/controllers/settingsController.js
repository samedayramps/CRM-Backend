"use strict";
// src/controllers/settingsController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePricingVariables = exports.getPricingVariables = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const getPricingVariables = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield Settings_1.default.findOne();
        if (!settings) {
            settings = yield Settings_1.default.create({
                pricingVariables: {
                    deliveryFeePerMile: 0,
                    installFeePerComponent: 0,
                    rentalRatePerFoot: 0,
                }
            });
        }
        res.status(200).json(settings.pricingVariables);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pricing variables', error });
    }
});
exports.getPricingVariables = getPricingVariables;
const updatePricingVariables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield Settings_1.default.findOne();
        if (!settings) {
            settings = new Settings_1.default();
        }
        settings.pricingVariables = req.body;
        yield settings.save();
        res.status(200).json(settings.pricingVariables);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating pricing variables', error });
    }
});
exports.updatePricingVariables = updatePricingVariables;
