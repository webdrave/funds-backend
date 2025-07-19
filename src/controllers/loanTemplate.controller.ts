import { Request, Response } from 'express';
import { LoanFormTemplate } from '../models';

export const createTemplate = async (req: Request, res: Response) => {
  const { name, loanType, fields, createdBy } = req.body;
  const template = await LoanFormTemplate.create({ name, loanType, fields, createdBy });
  res.status(201).json(template);
};

export const getTemplates = async (_req: Request, res: Response) => {
  const templates = await LoanFormTemplate.find();
  res.json(templates);
};

export const getTemplateByName = async (req: Request, res: Response) => {
  const {name} = req.params;
  const template = await LoanFormTemplate.findOne({name});
  if (!template) res.status(404).json({ message: 'Template not found' });
  res.status(200).json(template);
};

export const getTemplateById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const template = await LoanFormTemplate.findById(id);
  if (!template) res.status(404).json({ message: 'Template not found' });
  res.status(200).json(template);
};

export const updateTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, loanType, fields } = req.body;
  const template = await LoanFormTemplate.findByIdAndUpdate(id, { name, loanType, fields }, { new: true });
  if (!template) res.status(404).json({ message: 'Template not found' });
  res.json(template);
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const template = await LoanFormTemplate.findByIdAndDelete(id);
  if (!template) res.status(404).json({ message: 'Template not found' });
  res.json({ message: 'Template deleted' });
};
