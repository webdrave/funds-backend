import { Request, Response } from 'express';
import { Loan } from '../models';

export const createSubmission = async (req: Request, res: Response) => {
  const { templateId, values, applicant, loanType,loanSubType } = req.body;
  const submission = await Loan.create({ templateId, values, applicant, loanType,loanSubType });
  res.status(201).json(submission);
};

export const getSubmissions = async (req: Request, res: Response) => {
  const { templateId } = req.query;
  const filter = templateId ? { templateId } : {};
  const submissions = await Loan.find(filter);
  res.json(submissions);
};
