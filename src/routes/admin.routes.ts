import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authenticate, requireSuperadmin } from "../middleware";
const adminRoutes = Router();
// Define the route for creating an admin
adminRoutes.get("/", authenticate, requireSuperadmin, adminController.getAdmins);
adminRoutes.post("/register", authenticate, requireSuperadmin, adminController.createAdmin);
adminRoutes.post("/login", adminController.login);
adminRoutes.delete("/:id", authenticate, requireSuperadmin, adminController.deleteAdmin);
export default adminRoutes;
