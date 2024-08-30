"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RampComponentSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ['RS4', 'RS5', 'RS6', 'RS7', 'RS8', 'L55', 'L45', 'L85'],
        required: true
    },
    quantity: { type: Number, required: true, min: 1 }
});
const JobSchema = new mongoose_1.default.Schema({
    customer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Customer', required: true },
    installAddress: { type: String, required: true },
    status: {
        type: String,
        enum: ['New', 'Quoted', 'Scheduled', 'Installed', 'Completed'],
        required: true,
        default: 'New'
    },
    totalCost: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    rentalRate: { type: Number, required: true },
    overridePricing: { type: Boolean, default: false },
    scheduledDate: { type: Date },
    notes: { type: String },
    components: [RampComponentSchema],
    totalRampLength: { type: Number, default: 0 },
    totalLandings: { type: Number, default: 0 },
    distanceFromWarehouse: { type: Number, default: 0 }
}, { timestamps: true });
JobSchema.pre('save', function (next) {
    let rampLength = 0;
    let landings = 0;
    this.components.forEach(component => {
        if (component.type.startsWith('RS')) {
            rampLength += parseInt(component.type.slice(2)) * component.quantity;
        }
        else if (component.type.startsWith('L')) {
            landings += component.quantity;
        }
    });
    this.totalRampLength = rampLength;
    this.totalLandings = landings;
    next();
});
exports.default = mongoose_1.default.model('Job', JobSchema);
