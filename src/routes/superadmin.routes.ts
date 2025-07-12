import { Router } from "express";
import {
  getAdmins,
  createAdmin,
  login,
  deleteAdmin,
  application,
  getApplication,
  updateApplicationStatus
} from "../controllers/superadmin.controller";
import { authenticate, requireSuperadmin } from "../middleware";
import expressAsyncHandler from "express-async-handler";
const superadminRoutes = Router();

// Define the route for creating an admin
superadminRoutes.get("/", authenticate, requireSuperadmin, expressAsyncHandler(getAdmins));
superadminRoutes.post("/register", authenticate, requireSuperadmin, expressAsyncHandler(createAdmin));
superadminRoutes.post("/login", expressAsyncHandler(login));
superadminRoutes.delete("/:id", authenticate, requireSuperadmin, expressAsyncHandler(deleteAdmin));
// Define routes for application management
superadminRoutes.post("/application", expressAsyncHandler(application));
superadminRoutes.get("/application", authenticate, requireSuperadmin, expressAsyncHandler(getApplication));
superadminRoutes.put("/application/:id/status", authenticate, requireSuperadmin, expressAsyncHandler(updateApplicationStatus));
export default superadminRoutes;
