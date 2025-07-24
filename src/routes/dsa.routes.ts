import { Router } from "express";
import { authenticate } from "../middleware";
import expressAsyncHandler from "express-async-handler";
import { getDSAProfile, updateDSAProfile } from "../controllers/dsa.controller";

const dsaRoutes = Router();

// All routes assume /api prefix is handled globally
dsaRoutes.get("/:id", authenticate, expressAsyncHandler(getDSAProfile));
dsaRoutes.put("/:id", authenticate, expressAsyncHandler(updateDSAProfile));

export default dsaRoutes;
