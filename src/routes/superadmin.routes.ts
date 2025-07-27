import { Router } from "express";
import {
  getAdmins,
  createAdmin,
  login,
  deleteAdmin,
  updateAdmin,
  getAdmin,
  requestPasswordReset,
  verifyCodeAndResetPassword,
  getUsersByRole,
  getDsasByRmId
} from "../controllers/superadmin.controller";
import { authenticate, requireRM, requireSuperadmin } from "../middleware";
import expressAsyncHandler from "express-async-handler";
const superadminRoutes = Router();
superadminRoutes.get("/", authenticate, requireSuperadmin, expressAsyncHandler(getAdmins));
superadminRoutes.get("/:id", authenticate, requireSuperadmin, expressAsyncHandler(getAdmin));
superadminRoutes.get("/role/:role", authenticate, requireSuperadmin, expressAsyncHandler(getUsersByRole));
superadminRoutes.post("/", authenticate, requireSuperadmin, expressAsyncHandler(createAdmin));
superadminRoutes.get("/dsa/:rmId", authenticate, requireRM, expressAsyncHandler(getDsasByRmId));
superadminRoutes.patch("/:id", authenticate, requireSuperadmin, expressAsyncHandler(updateAdmin));
superadminRoutes.post("/login", expressAsyncHandler(login));
superadminRoutes.delete("/:id", authenticate, expressAsyncHandler(deleteAdmin));
superadminRoutes.post("/reset-pass", expressAsyncHandler(requestPasswordReset));
superadminRoutes.post("/verify-reset", expressAsyncHandler(verifyCodeAndResetPassword));

export default superadminRoutes;
