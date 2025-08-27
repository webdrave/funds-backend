// src/controllers/commission.controller.ts
import { Request, Response, NextFunction } from "express";
import { Commission, Loan, Admin } from "../models";
import HttpStatusCodes from "../common/httpstatuscode";

export const createCommissionForLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Accept loanId + optional percentage override, or compute from loan
    const { loanId, percentage, amount } = req.body;
    if (!loanId) {
      res.status(400).json({ message: "loanId required" });
      return
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ message: "Loan not found" });
      return
    }

    // default calculation: use `percentage` if provided, else default 1% (example)
    const pct = typeof percentage === "number" ? percentage : 1; // adjust default
    const calculatedAmount = amount ?? Math.round((Number(/*loan value placeholder*/ 0) * pct) / 100);

    const commission = await Commission.create({
      loanId,
      dsaId: loan.dsaId,
      rmId: loan.rmId,
      amount: calculatedAmount,
      percentage: pct,
      createdBy: req.user?.userId, // put your auth user id
    });

    res.status(HttpStatusCodes.CREATED).json(commission);
  } catch (err) {
    next(err);
  }
};

export const getCommissionByLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loanId } = req.params;
    const com = await Commission.findOne({ loanId }).populate("dsaId rmId createdBy");
    if (!com) {
      res.status(404).json({ message: "Commission not found" });
      return
    }
    res.status(200).json(com);
  } catch (err) { next(err); }
};

export const listCommissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    const { rmId, dsaId, status, search } = req.query;
    if (rmId) filter.rmId = rmId;
    if (dsaId) filter.dsaId = dsaId;
    if (status) filter.status = status;
    // add pagination if needed
    const commissions = await Commission.find(filter).sort({ createdAt: -1 }).limit(100).populate("loanId dsaId rmId");
    res.json({ total: commissions.length, commissions });
  } catch (err) { next(err); }
};

export const updateCommission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Authorization: RM can update only if they are rmId; superadmin can update all
    const existing = await Commission.findById(id);
    if (!existing) {
       res.status(404).json({ message: "Not found" });
       return
    }
    // Example role validation (adapt to your middleware + req.user)
    const user = req.user; // make sure your auth middleware attaches user info
    const isSuper = user?.role === "SUPERADMIN";
    const isRM = user?.role === "RM" && existing.rmId?.toString() === user.userId;

    if (!isSuper && !isRM) {
       res.status(403).json({ message: "Forbidden" });
       return
    }

    const updated = await Commission.findByIdAndUpdate(id, updates, { new: true });

    // if commission moved to 'credited', optionally update Admin.balance
    if (updates.status === "credited") {
      if (existing.dsaId) {
        await Admin.findByIdAndUpdate(existing.dsaId, { $inc: { balance: updated!.amount } });
      }
      if (existing.rmId) {
        await Admin.findByIdAndUpdate(existing.rmId, { $inc: { balance: updated!.amount } });
      }
    }

    res.json(updated);
  } catch (err) { next(err); }
};
