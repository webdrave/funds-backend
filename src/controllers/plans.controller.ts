import { Request, Response } from "express";
import { planSchema, updatePlanStatusSchema } from "../validators/plan.schema";
import { Plan } from "../models";

export const getPlans = async (_req: Request, res: Response) => {
  const plans = await Plan.find().sort({ createdAt: -1 });
  res.json(plans);
};

export const createPlan = async (req: Request, res: Response) => {
  const parseResult = planSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    return;
  }

  const newPlan = await Plan.create(parseResult.data);
  res.status(201).json(newPlan);
};

export const getPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await Plan.findById(id);
  if (!plan) {
    res.status(404).json({ message: "Plan not found" });
    return;
  }
  res.json(plan);
};

export const updatePlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  const parseResult = planSchema.safeParse(req.body);
  if (!parseResult.success) {
     res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
     return;
  }

  const updated = await Plan.findByIdAndUpdate(id, parseResult.data, { new: true });
  res.json(updated);
};

export const updatePlanStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  const parseResult = updatePlanStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
     res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
     return;
  }

  const isActive = parseResult.data.status === "active";

  const updated = await Plan.findByIdAndUpdate(id, { isActive }, { new: true });
  res.json(updated);
};

export const deletePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Plan.findByIdAndDelete(id);
  res.status(204).send();
};
