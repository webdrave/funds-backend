import { Request, Response } from 'express';
import { LoanFormTemplate } from '../models';

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, loanType, description, icon, pages, createdBy } = req.body;

    if (!name || !loanType || !createdBy || !Array.isArray(pages)) {
       res.status(400).json({ error: "Missing required fields or pages format is invalid" });
       return
    }

    const template = await LoanFormTemplate.create({
      name,
      loanType,
      description,
      icon,
      pages,
      createdBy,
    });

     res.status(201).json(template);

  } catch (error) {
    console.error("Error creating loan template:", error);
     res.status(500).json({ error: "Failed to create loan template" });
  }
};

export const getTemplateNamesByLoanType = async (req: Request, res: Response) => {
  const { loanType } = req.params;

  try {
    const templates = await LoanFormTemplate.find({ loanType });

    const result = templates.map(template => ({
      id: template._id,
      name: template.name,
      icon: template.icon,
      description: template.description,
    }));

     res.status(200).json(result);
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getTemplates = async (_req: Request, res: Response) => {
  try {
    const templates = await LoanFormTemplate.find();
     res.status(200).json(templates);
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const template = await LoanFormTemplate.findById(id);
    if (!template) {
       res.status(404).json({ message: 'Template not found' });
        return
    }
 res.status(200).json(template);
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, loanType, description, icon, pages } = req.body;

  try {
    if (!name || !loanType || !Array.isArray(pages)) {
       res.status(400).json({ message: "Missing or invalid fields" });
       return
    }

    const updatedTemplate = await LoanFormTemplate.findByIdAndUpdate(
      id,
      { name, loanType, description, icon, pages },
      { new: true }
    );

    if (!updatedTemplate) {
       res.status(404).json({ message: 'Template not found' });
       return
    }

     res.json(updatedTemplate);
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await LoanFormTemplate.findByIdAndDelete(id);
    if (!deleted) {
       res.status(404).json({ message: 'Template not found' });
       return
    }
     res.json({ message: 'Template deleted' });
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
  }
};
