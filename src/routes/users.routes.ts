import { Router } from "express";
import usersController from "../controllers/users.controller";
const router = Router();
// Define the route for creating a user
router.post("/", usersController.createUser);
router.post("/login", usersController.login);

export default router;
