"use strict";
// src/routes/jobRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').post(authMiddleware_1.protect, jobController_1.createJob).get(authMiddleware_1.protect, jobController_1.getJobs);
router.route('/:id').get(authMiddleware_1.protect, jobController_1.getJobById).put(authMiddleware_1.protect, jobController_1.updateJob).delete(authMiddleware_1.protect, jobController_1.deleteJob);
router.route('/:id/components').post(authMiddleware_1.protect, jobController_1.addComponentToJob);
router.route('/:id/components/:componentId').delete(authMiddleware_1.protect, jobController_1.removeComponentFromJob);
exports.default = router;
