import { z } from "zod";

export const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().int().nonnegative("Amount must be non-negative"),
  duration: z.number().int(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
});

export const updatePlanStatusSchema = z.object({
  status: z.enum(["active", "inactive"]),
});
