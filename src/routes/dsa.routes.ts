import { Router } from "express";
import { authenticate } from "../middleware";
import expressAsyncHandler from "express-async-handler";
import { getDSAProfile, updateDSAProfile, getBankInfo } from "../controllers/dsa.controller";

const dsaRoutes = Router();

// All routes assume /api prefix is handled globally
dsaRoutes.get("/:id", authenticate, expressAsyncHandler(getDSAProfile));
dsaRoutes.put("/:id", authenticate, expressAsyncHandler(updateDSAProfile));
dsaRoutes.get("/bankInfo/:id", authenticate, expressAsyncHandler(getBankInfo));

export default dsaRoutes;
