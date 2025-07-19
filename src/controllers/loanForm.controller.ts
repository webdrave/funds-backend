import { Request, Response } from 'express';
import { Loan } from '../models';

export const createLoan = async (req: Request, res: Response) => {
  const { values, applicant, loanType,loanSubType } = req.body;
  const submission = await Loan.create({ values, applicant, loanType,loanSubType });
  res.status(201).json(submission);
};

export const getLoans = async (req: Request, res: Response) => {
  const { loanType } = req.query;
  const filter = loanType ? { loanType } : {};
  const submissions = await Loan.find(filter);
  res.json(submissions);
};
export const updateLoan = async (req: Request, res: Response) => {
  const { _id, status, rejectionMessage } = req.body;
  if (!_id || !status || !["approved", "rejected"].includes(status)) {
    res.status(400).json({ message: "Invalid request: id and valid status required." });
  }
  const update: any = { status };
  if (status === "rejected") {
    update.rejectionMessage = rejectionMessage || "";
  } else if (status === "approved") {
    update.rejectionMessage = undefined;
  }
  const updatedLoan = await Loan.findByIdAndUpdate(_id, update, { new: true });
  if (!updatedLoan) {
    res.status(404).json({ message: "Loan not found" });
  }
  res.json(updatedLoan);
};
