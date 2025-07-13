import { Request, Response } from "express";
import { planSchema, updatePlanStatusSchema } from "../validators/plan.schema";
import { prisma } from "../utils/prismaclient";

export const getPlans = async (_req: Request, res: Response) => {
  const plans = await prisma.plan.findMany({ orderBy: { createdAt: "desc" } });
  res.json(plans);
};

export const createPlan = async (req: Request, res: Response) => {
  const parseResult = planSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    return;
}

  const newPlan = await prisma.plan.create({
    data: parseResult.data,
  });

  res.status(201).json(newPlan);
};

export const getPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await prisma.plan.findUnique({ where: { id } });
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
     return
  }

  const updated = await prisma.plan.update({
    where: { id },
    data: parseResult.data,
  });

  res.json(updated);
};

export const updatePlanStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  const parseResult = updatePlanStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
     res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
     return
  }

  const isActive = parseResult.data.status === "active";

  const updated = await prisma.plan.update({
    where: { id },
    data: { isActive },
  });

  res.json(updated);
};

export const deletePlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.plan.delete({
    where: { id },
  });

  res.status(204).send();
};
