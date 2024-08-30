// src/controllers/jobController.ts

import { Request, Response } from 'express';
import Job, { IJob, IRampComponent } from '../models/Job';
import Settings from '../models/Settings';

export const createJob = async (req: Request, res: Response) => {
  try {
    const jobData = req.body;
    if (!jobData.overridePricing) {
      const settings = await Settings.findOne();
      if (!settings) {
        return res.status(404).json({ message: 'Pricing settings not found' });
      }
      const { deliveryFeePerMile, installFeePerComponent, rentalRatePerFoot } = settings.pricingVariables;
      
      jobData.deliveryFee = jobData.distanceFromWarehouse * deliveryFeePerMile;
      jobData.installFee = jobData.components.reduce((sum: number, comp: IRampComponent) => sum + comp.quantity, 0) * installFeePerComponent;
      jobData.rentalRate = jobData.totalRampLength * rentalRatePerFoot;
      jobData.totalCost = jobData.deliveryFee + jobData.installFee + jobData.rentalRate;
    }

    const job: IJob = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job', error });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const jobData = req.body;
    if (!jobData.overridePricing) {
      const settings = await Settings.findOne();
      if (!settings) {
        return res.status(404).json({ message: 'Pricing settings not found' });
      }
      const { deliveryFeePerMile, installFeePerComponent, rentalRatePerFoot } = settings.pricingVariables;
      
      jobData.deliveryFee = jobData.distanceFromWarehouse * deliveryFeePerMile;
      jobData.installFee = jobData.components.reduce((sum: number, comp: IRampComponent) => sum + comp.quantity, 0) * installFeePerComponent;
      jobData.rentalRate = jobData.totalRampLength * rentalRatePerFoot;
      jobData.totalCost = jobData.deliveryFee + jobData.installFee + jobData.rentalRate;
    }

    const job: IJob | null = await Job.findByIdAndUpdate(req.params.id, jobData, { new: true });
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating job', error });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId as string;
    let query = customerId ? { customer: customerId } : {};
    const jobs: IJob[] = await Job.find(query).populate('customer', 'firstName lastName');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching jobs', error });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job: IJob | null = await Job.findById(req.params.id).populate('customer', 'firstName lastName');
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error fetching job', error });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job: IJob | null = await Job.findByIdAndDelete(req.params.id);
    if (job) {
      res.status(200).json({ message: 'Job deleted successfully' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting job', error });
  }
};

export const addComponentToJob = async (req: Request, res: Response) => {
  try {
    const job: IJob | null = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    job.components.push(req.body);
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error adding component to job', error });
  }
};

export const removeComponentFromJob = async (req: Request, res: Response) => {
  try {
    const job: IJob | null = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    job.components = job.components.filter(c => c._id?.toString() !== req.params.componentId);
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error removing component from job', error });
  }
};

export const getPricingVariables = async (_req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Pricing settings not found' });
    }
    res.status(200).json(settings.pricingVariables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricing variables', error });
  }
};