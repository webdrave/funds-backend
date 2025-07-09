import { Router } from "express";
import usersController from "../controllers/users.controller";
const router = Router();
// Define the route for creating a user
router.post("/application", usersController.application);
router.get("/application", usersController.getApplication);
router.put("/application/:id/status", usersController.updateApplicationStatus);

export default router;
