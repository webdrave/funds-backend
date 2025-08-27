// src/routes/commission.routes.ts
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { authenticate, requireRM, requireSuperadmin } from "../middleware";
import {
  createCommissionForLoan,
  getCommissionByLoan,
  listCommissions,
  updateCommission
} from "../controllers/commission.controller";

const router = Router();

router.post("/", authenticate, requireSuperadmin, expressAsyncHandler(createCommissionForLoan)); // or internal
router.get("/", authenticate, requireSuperadmin, expressAsyncHandler(listCommissions));
router.get("/my", authenticate, expressAsyncHandler(async (req, res) => {
  // return commissions for req.user.userId
}));
router.get("/loan/:loanId", authenticate, expressAsyncHandler(getCommissionByLoan));
router.patch("/:id", authenticate, expressAsyncHandler(updateCommission));

export default router;
