import { Router } from "express";
import {
  getAdmins,
  createAdmin,
  login,
  deleteAdmin,
  updateAdmin,
  getAdmin,
  requestPasswordReset,
  verifyCodeAndResetPassword
} from "../controllers/superadmin.controller";
import { authenticate, requireSuperadmin } from "../middleware";
import expressAsyncHandler from "express-async-handler";
const superadminRoutes = Router();

superadminRoutes.get("/", authenticate, requireSuperadmin, expressAsyncHandler(getAdmins));
superadminRoutes.get("/:id", authenticate, requireSuperadmin, expressAsyncHandler(getAdmin));
superadminRoutes.post("/", authenticate, requireSuperadmin, expressAsyncHandler(createAdmin));
superadminRoutes.patch("/:id", authenticate, requireSuperadmin, expressAsyncHandler(updateAdmin));
superadminRoutes.post("/login", expressAsyncHandler(login));
superadminRoutes.delete("/:id", authenticate, requireSuperadmin, expressAsyncHandler(deleteAdmin));
superadminRoutes.post("/reset-pass", expressAsyncHandler(requestPasswordReset));
superadminRoutes.post("/verify-reset", expressAsyncHandler(verifyCodeAndResetPassword));
export default superadminRoutes;
