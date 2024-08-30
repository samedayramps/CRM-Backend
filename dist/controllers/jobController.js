"use strict";
// src/controllers/jobController.ts
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
exports.getPricingVariables = exports.removeComponentFromJob = exports.addComponentToJob = exports.deleteJob = exports.getJobById = exports.getJobs = exports.updateJob = exports.createJob = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const Settings_1 = __importDefault(require("../models/Settings"));
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobData = req.body;
        if (!jobData.overridePricing) {
            const settings = yield Settings_1.default.findOne();
            if (!settings) {
                return res.status(404).json({ message: 'Pricing settings not found' });
            }
            const { deliveryFeePerMile, installFeePerComponent, rentalRatePerFoot } = settings.pricingVariables;
            jobData.deliveryFee = jobData.distanceFromWarehouse * deliveryFeePerMile;
            jobData.installFee = jobData.components.reduce((sum, comp) => sum + comp.quantity, 0) * installFeePerComponent;
            jobData.rentalRate = jobData.totalRampLength * rentalRatePerFoot;
            jobData.totalCost = jobData.deliveryFee + jobData.installFee + jobData.rentalRate;
        }
        const job = yield Job_1.default.create(jobData);
        res.status(201).json(job);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating job', error });
    }
});
exports.createJob = createJob;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobData = req.body;
        if (!jobData.overridePricing) {
            const settings = yield Settings_1.default.findOne();
            if (!settings) {
                return res.status(404).json({ message: 'Pricing settings not found' });
            }
            const { deliveryFeePerMile, installFeePerComponent, rentalRatePerFoot } = settings.pricingVariables;
            jobData.deliveryFee = jobData.distanceFromWarehouse * deliveryFeePerMile;
            jobData.installFee = jobData.components.reduce((sum, comp) => sum + comp.quantity, 0) * installFeePerComponent;
            jobData.rentalRate = jobData.totalRampLength * rentalRatePerFoot;
            jobData.totalCost = jobData.deliveryFee + jobData.installFee + jobData.rentalRate;
        }
        const job = yield Job_1.default.findByIdAndUpdate(req.params.id, jobData, { new: true });
        if (job) {
            res.status(200).json(job);
        }
        else {
            res.status(404).json({ message: 'Job not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating job', error });
    }
});
exports.updateJob = updateJob;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.query.customerId;
        let query = customerId ? { customer: customerId } : {};
        const jobs = yield Job_1.default.find(query).populate('customer', 'firstName lastName');
        res.status(200).json(jobs);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching jobs', error });
    }
});
exports.getJobs = getJobs;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id).populate('customer', 'firstName lastName');
        if (job) {
            res.status(200).json(job);
        }
        else {
            res.status(404).json({ message: 'Job not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching job', error });
    }
});
exports.getJobById = getJobById;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findByIdAndDelete(req.params.id);
        if (job) {
            res.status(200).json({ message: 'Job deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Job not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting job', error });
    }
});
exports.deleteJob = deleteJob;
const addComponentToJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        job.components.push(req.body);
        yield job.save();
        res.status(200).json(job);
    }
    catch (error) {
        res.status(400).json({ message: 'Error adding component to job', error });
    }
});
exports.addComponentToJob = addComponentToJob;
const removeComponentFromJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        job.components = job.components.filter(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) !== req.params.componentId; });
        yield job.save();
        res.status(200).json(job);
    }
    catch (error) {
        res.status(400).json({ message: 'Error removing component from job', error });
    }
});
exports.removeComponentFromJob = removeComponentFromJob;
const getPricingVariables = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield Settings_1.default.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Pricing settings not found' });
        }
        res.status(200).json(settings.pricingVariables);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pricing variables', error });
    }
});
exports.getPricingVariables = getPricingVariables;
