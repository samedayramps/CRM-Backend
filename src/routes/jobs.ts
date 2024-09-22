import express, { Request, Response, NextFunction } from 'express';
import { Job, IJob } from '../models/Job';
import { Customer, ICustomer } from '../models/Customer';
import { CustomError } from '../utils/CustomError';
import { Types } from 'mongoose';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/calendarService';

const router = express.Router();

// Get all jobs
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await Job.find().populate('quoteId').populate('customerId');
    res.json(jobs);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Get a specific job
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid job ID', 400));
    }
    const job = await Job.findById(id).populate('quoteId').populate('customerId');
    if (!job) {
      return next(new CustomError('Job not found', 404));
    }
    res.json(job);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Schedule installation
router.post('/:id/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { installationDate } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid job ID', 400));
    }

    const job = await Job.findById(id).populate<{ customerId: ICustomer }>('customerId');
    if (!job) {
      return next(new CustomError('Job not found', 404));
    }

    job.installationDate = new Date(installationDate);
    job.status = 'scheduled';

    // Create calendar event
    const event = await createCalendarEvent({
      summary: `Ramp Installation for ${job.customerId.firstName} ${job.customerId.lastName}`,
      description: `Installation for Job ID: ${job._id}`,
      startDateTime: job.installationDate,
      endDateTime: new Date(job.installationDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
      location: job.address,
    });

    if (event && event.id) {
      job.calendarEventId = event.id;
    }
    await job.save();

    res.json(job);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Reschedule installation
router.put('/:id/reschedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { installationDate } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid job ID', 400));
    }

    const job = await Job.findById(id).populate<{ customerId: ICustomer }>('customerId');
    if (!job) {
      return next(new CustomError('Job not found', 404));
    }

    job.installationDate = new Date(installationDate);

    // Update calendar event
    if (job.calendarEventId) {
      await updateCalendarEvent(job.calendarEventId, {
        summary: `Ramp Installation for ${job.customerId.firstName} ${job.customerId.lastName}`,
        description: `Installation for Job ID: ${job._id}`,
        startDateTime: job.installationDate,
        endDateTime: new Date(job.installationDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        location: job.address,
      });
    }

    await job.save();

    res.json(job);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Cancel installation
router.put('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid job ID', 400));
    }

    const job = await Job.findById(id);
    if (!job) {
      return next(new CustomError('Job not found', 404));
    }

    job.status = 'cancelled';

    // Delete calendar event
    if (job.calendarEventId) {
      await deleteCalendarEvent(job.calendarEventId);
      job.calendarEventId = undefined;
    }

    await job.save();

    res.json(job);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;