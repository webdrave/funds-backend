import { Request, Response } from 'express';
import { LoanFormSubmission } from '../models';

export const createSubmission = async (req: Request, res: Response) => {
  const { templateId, values, submittedBy } = req.body;
  const submission = await LoanFormSubmission.create({ templateId, values, submittedBy });
  res.status(201).json(submission);
};

export const getSubmissions = async (req: Request, res: Response) => {
  const { templateId } = req.query;
  const filter = templateId ? { templateId } : {};
  const submissions = await LoanFormSubmission.find(filter);
  res.json(submissions);
};
