"use strict";
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
exports.deleteAllCustomers = exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, notes } = req.body;
        const customer = yield Customer_1.default.create({
            firstName,
            lastName,
            email,
            phone,
            notes
        });
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating customer', error });
    }
});
exports.createCustomer = createCustomer;
const getCustomers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield Customer_1.default.find();
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching customers', error });
    }
});
exports.getCustomers = getCustomers;
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield Customer_1.default.findById(req.params.id);
        if (customer) {
            res.status(200).json(customer);
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching customer', error });
    }
});
exports.getCustomerById = getCustomerById;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, notes } = req.body;
        const customer = yield Customer_1.default.findByIdAndUpdate(req.params.id, { firstName, lastName, email, phone, notes }, { new: true });
        if (customer) {
            res.status(200).json(customer);
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating customer', error });
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield Customer_1.default.findByIdAndDelete(req.params.id);
        if (customer) {
            res.status(200).json({ message: 'Customer deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting customer', error });
    }
});
exports.deleteCustomer = deleteCustomer;
const deleteAllCustomers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Customer_1.default.deleteMany({});
        res.status(200).json({ message: 'All customers have been deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting all customers', error });
    }
});
exports.deleteAllCustomers = deleteAllCustomers;
