import { Router } from "express";
import { authenticate, requireSuperadmin } from "../middleware";
import expressAsyncHandler from "express-async-handler";
import {
  getPlans,
  createPlan,
  updatePlan,
  updatePlanStatus,
  deletePlan,
  getPlan,
} from "../controllers/plans.controller";

const plansRoutes = Router();

// All routes assume /api prefix is handled globally

plansRoutes.get("/:id", authenticate, expressAsyncHandler(getPlan));
plansRoutes.get("/", authenticate, requireSuperadmin, expressAsyncHandler(getPlans));
plansRoutes.post("/", authenticate, requireSuperadmin, expressAsyncHandler(createPlan));
plansRoutes.put("/:id", authenticate, requireSuperadmin, expressAsyncHandler(updatePlan));
plansRoutes.put("/:id/status", authenticate, requireSuperadmin, expressAsyncHandler(updatePlanStatus));
plansRoutes.delete("/:id", authenticate, requireSuperadmin, expressAsyncHandler(deletePlan));

export default plansRoutes;

