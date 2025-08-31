// src/routes/commission.routes.ts
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { authenticate, requireDSA, requireRM, requireSuperadmin } from "../middleware";
import {
  createCommissionForLoan,
  getCommissionById,
  getCommissionByLoan,
  listCommissions,
  updateCommission
} from "../controllers/commission.controller";
import { Commission } from "../models";

const router = Router();

router.post("/", authenticate, requireRM, expressAsyncHandler(createCommissionForLoan)); // or internal
router.get("/", authenticate, requireSuperadmin, expressAsyncHandler(listCommissions));
router.get("/my", authenticate, requireDSA, expressAsyncHandler(getCommissionById));

router.get("/loan/:loanId", authenticate, expressAsyncHandler(getCommissionByLoan));
router.patch("/:id", authenticate, expressAsyncHandler(updateCommission));

export default router;
