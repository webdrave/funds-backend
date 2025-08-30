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
import { Commission } from "../models";

const router = Router();

router.post("/", authenticate, requireRM, expressAsyncHandler(createCommissionForLoan)); // or internal
router.get("/", authenticate, requireSuperadmin, expressAsyncHandler(listCommissions));
router.get("/my", authenticate, expressAsyncHandler(async (req: any, res) => {
  if (!req.user || !req.user.userId) {
     res.status(401).json({ message: "Unauthorized" });
     return
  }

  const commissions = await Commission.find({ dsaId: req.user.userId }).lean();
  res.json(commissions);
}));

router.get("/loan/:loanId", authenticate, expressAsyncHandler(getCommissionByLoan));
router.patch("/:id", authenticate, expressAsyncHandler(updateCommission));

export default router;
