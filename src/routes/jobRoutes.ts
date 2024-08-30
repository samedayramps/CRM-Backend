// src/routes/jobRoutes.ts

import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, addComponentToJob, removeComponentFromJob } from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createJob).get(protect, getJobs);
router.route('/:id').get(protect, getJobById).put(protect, updateJob).delete(protect, deleteJob);
router.route('/:id/components').post(protect, addComponentToJob);
router.route('/:id/components/:componentId').delete(protect, removeComponentFromJob);

export default router;