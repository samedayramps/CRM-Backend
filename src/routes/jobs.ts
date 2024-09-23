import express, { Request, Response, NextFunction } from 'express';
import { Job, IJob } from '../models/Job';
import { Customer, ICustomer } from '../models/Customer';
import { CustomError } from '../utils/CustomError';
import { Types } from 'mongoose';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, CalendarError } from '../services/calendarService';
import { createJobFromQuote, getJobById, updateJob, deleteJob } from '../services/jobService';
import { Quote } from '../models/Quote';

const router = express.Router();

// Helper function to handle errors
const handleError = (error: any, next: NextFunction) => {
  console.error('Error:', error);
  if (error instanceof CustomError) {
    next(error);
  } else {
    next(new CustomError(error.message || 'An unexpected error occurred', error.statusCode || 500));
  }
};

// Get all jobs (with pagination)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .populate('quoteId')
      .populate('customerId')
      .skip(skip)
      .limit(limit)
      .sort({ scheduledInstallationDate: 1 });

    const total = await Job.countDocuments();

    res.json({
      jobs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total
    });
  } catch (error: any) {
    handleError(error, next);
  }
});

// Get a specific job
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }
    const job = await getJobById(id);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }
    res.json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Create a job from a quote
router.post('/create-from-quote/:quoteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.params;
    if (!Types.ObjectId.isValid(quoteId)) {
      throw new CustomError('Invalid quote ID', 400);
    }
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    const job = await createJobFromQuote(quote);
    res.status(201).json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Schedule installation
router.post('/:id/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { installationDate } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }

    const job = await Job.findById(id).populate<{ customerId: ICustomer }>('customerId').populate('quoteId');
    if (!job) {
      throw new CustomError('Job not found', 404);
    }

    job.scheduledInstallationDate = new Date(installationDate);
    job.status = 'scheduled';

    // Create calendar event
    try {
      const event = await createCalendarEvent({
        summary: `Ramp Installation for ${job.customerId.firstName} ${job.customerId.lastName}`,
        description: `Installation for Job ID: ${job.jobId}\nQuote ID: ${job.quoteId._id}\nCustomer: ${job.customerId.firstName} ${job.customerId.lastName}\nPhone: ${job.customerId.phone}\nEmail: ${job.customerId.email}\nRamp Configuration: ${JSON.stringify(job.rampConfiguration)}`,
        startDateTime: job.scheduledInstallationDate,
        endDateTime: new Date(job.scheduledInstallationDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        location: job.installAddress,
      });

      if (event && event.id) {
        job.calendarEventId = event.id;
      }
    } catch (calendarError) {
      console.error('Failed to create calendar event:', calendarError);
      // Continue with job creation even if calendar event creation fails
    }

    await job.save();
    res.json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Reschedule installation
router.put('/:id/reschedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { installationDate } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }

    const job = await Job.findById(id).populate<{ customerId: ICustomer }>('customerId').populate('quoteId');
    if (!job) {
      throw new CustomError('Job not found', 404);
    }

    job.scheduledInstallationDate = new Date(installationDate);

    // Update calendar event
    if (job.calendarEventId) {
      try {
        await updateCalendarEvent(job.calendarEventId, {
          summary: `Ramp Installation for ${job.customerId.firstName} ${job.customerId.lastName}`,
          description: `Installation for Job ID: ${job.jobId}\nQuote ID: ${job.quoteId._id}\nCustomer: ${job.customerId.firstName} ${job.customerId.lastName}\nPhone: ${job.customerId.phone}\nEmail: ${job.customerId.email}\nRamp Configuration: ${JSON.stringify(job.rampConfiguration)}`,
          startDateTime: job.scheduledInstallationDate,
          endDateTime: new Date(job.scheduledInstallationDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
          location: job.installAddress,
        });
      } catch (calendarError) {
        console.error('Failed to update calendar event:', calendarError);
        // Continue with job update even if calendar event update fails
      }
    }

    await job.save();
    res.json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Cancel installation
router.put('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }

    const job = await Job.findById(id);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }

    job.status = 'cancelled';

    // Delete calendar event
    if (job.calendarEventId) {
      try {
        await deleteCalendarEvent(job.calendarEventId);
        job.calendarEventId = undefined;
      } catch (calendarError) {
        console.error('Failed to delete calendar event:', calendarError);
        // Continue with job cancellation even if calendar event deletion fails
      }
    }

    await job.save();
    res.json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Update a job
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }

    const job = await updateJob(id, updates);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }

    res.json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Delete a job
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }

    await deleteJob(id);
    res.status(204).send();
  } catch (error: any) {
    handleError(error, next);
  }
});

// Get jobs by status
router.get('/status/:status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    const validStatuses = ['scheduled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new CustomError('Invalid status', 400);
    }
    const jobs = await Job.find({ status })
      .populate('quoteId')
      .populate('customerId')
      .sort({ scheduledInstallationDate: 1 });
    res.json(jobs);
  } catch (error: any) {
    handleError(error, next);
  }
});

// Mark job as completed
router.put('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { actualInstallationDate } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid job ID', 400);
    }

    const job = await Job.findById(id);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }

    job.status = 'completed';
    job.actualInstallationDate = new Date(actualInstallationDate);

    await job.save();
    res.json(job);
  } catch (error: any) {
    handleError(error, next);
  }
});

export default router;