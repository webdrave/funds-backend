// src/routes/withdrawal.routes.ts
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { authenticate, requireSuperadmin, requireRM } from "../middleware";
import {
  createWithdrawRequest,
  listWithdrawals,
  updateWithdrawStatus
} from "../controllers/withdrawal.controller";

const router = Router();

router.post("/", authenticate, expressAsyncHandler(createWithdrawRequest));
router.get("/", authenticate, requireSuperadmin, expressAsyncHandler(listWithdrawals)); // admin view
router.get("/my", authenticate, expressAsyncHandler(listWithdrawals)); // user view: add userId filter in controller
router.patch("/:id", authenticate, requireSuperadmin, expressAsyncHandler(updateWithdrawStatus));

export default router;
