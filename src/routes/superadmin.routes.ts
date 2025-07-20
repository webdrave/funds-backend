import { Router } from "express";
import {
  getAdmins,
  createAdmin,
  login,
  deleteAdmin
} from "../controllers/superadmin.controller";
import { authenticate, requireSuperadmin } from "../middleware";
import expressAsyncHandler from "express-async-handler";
const superadminRoutes = Router();

superadminRoutes.get("/", authenticate, requireSuperadmin, expressAsyncHandler(getAdmins));
superadminRoutes.post("/register", authenticate, requireSuperadmin, expressAsyncHandler(createAdmin));
superadminRoutes.post("/login", expressAsyncHandler(login));
superadminRoutes.delete("/:id", authenticate, requireSuperadmin, expressAsyncHandler(deleteAdmin));
export default superadminRoutes;
