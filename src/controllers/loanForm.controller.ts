import { Request, Response } from 'express';
import { Loan, LoanFormTemplate } from '../models';
import { ILoanFormTemplate } from '../models'; // adjust path if needed

export const createLoan = async (req: Request, res: Response) => {
  try {
    const { formData, subscriber, loanType, loanSubType, templateId } = req.body;

    if (!templateId) {
       res.status(400).json({ message: 'templateId is required' });
       return
    }

    const template: ILoanFormTemplate | null = await LoanFormTemplate.findById(templateId);
    if (!template) {
       res.status(404).json({ message: 'Loan form template not found' });
       return
    }

    const structuredValues = template.pages.map(page => ({
      pageNumber: page.pageNumber,
      title: page.title,
      fields: page.fields.map(field => ({
        label: field.label,
        value: formData[field.label] ?? null,
        isDocument: field.type === 'document',
      })),
    }));

    const submission = await Loan.create({
      values: structuredValues,
      subscriber,
      loanType,
      loanSubType,
    });

    res.status(201).json(submission);
  } catch (err: any) {
    console.error('Error creating loan:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLoans = async (req: Request, res: Response) => {
  try {
    const { loanType } = req.query;
    const filter = loanType ? { loanType } : {};
    const submissions = await Loan.find(filter);
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateLoan = async (req: Request, res: Response) => {
  try {
    const { _id, status, rejectionMessage } = req.body;

    if (!_id || !status || !["approved", "rejected"].includes(status)) {
       res.status(400).json({ message: "Invalid request: id and valid status required." });
       return
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
       return
    }

    res.json(updatedLoan);
  } catch (err) {
    console.error('Error updating loan:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
