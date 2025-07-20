import { Router } from "express";
import {
  application,
  getApplication,
  updateApplicationStatus
} from "../controllers/application.controller";
import { authenticate, requireSuperadmin } from "../middleware";
import expressAsyncHandler from "express-async-handler";
const applicationRoutes = Router();

applicationRoutes.post("/", expressAsyncHandler(application));
applicationRoutes.get("/", authenticate, requireSuperadmin, expressAsyncHandler(getApplication));
applicationRoutes.put("/:id", authenticate, requireSuperadmin, expressAsyncHandler(updateApplicationStatus));
export default applicationRoutes;
