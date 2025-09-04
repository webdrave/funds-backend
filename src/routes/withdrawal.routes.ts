// src/routes/withdrawal.routes.ts
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { authenticate, requireSuperadmin, requireRM, requireDSA } from "../middleware";
import {
  createWithdrawRequest,
  getWithdrawalRequests,
  getWithdrawalRequestsByRM,
  getWithdrawalRequestsBySuperadmin,
  listWithdrawals,
  updateWithdrawStatus
} from "../controllers/withdrawal.controller";
import { get } from "http";

const router = Router();

router.post("/", authenticate, expressAsyncHandler(createWithdrawRequest));
router.get("/", authenticate, requireSuperadmin, expressAsyncHandler(listWithdrawals)); // admin view
router.get("/my", authenticate, requireDSA, expressAsyncHandler(getWithdrawalRequests));
router.get("/rm", authenticate, requireDSA, expressAsyncHandler(getWithdrawalRequestsByRM));
router.patch("/:id", authenticate, requireRM, expressAsyncHandler(updateWithdrawStatus));
router.get("/superadmin", authenticate, requireSuperadmin, expressAsyncHandler(getWithdrawalRequestsBySuperadmin));

export default router;
