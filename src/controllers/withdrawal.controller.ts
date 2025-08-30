// src/controllers/withdrawal.controller.ts
import { Request, Response, NextFunction } from "express";
import { WithdrawRequest, Admin, Commission } from "../models";
import HttpStatusCodes from "../common/httpstatuscode";

export const createWithdrawRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const userId = req.user?.userId;
    const { amount, remarks } = req.body;
    if (!userId || !amount || amount <= 0) {
       res.status(400).json({ message: "Invalid request" });
       return
    }

    // check balance (if you stored balance on Admin)
    const admin = await Admin.findById(userId);
    if (!admin) { res.status(404).json({ message: "User not found" });
      return
    }
    if ((admin.balance || 0) < amount) {
      res.status(400).json({ message: "Insufficient balance" });
      return
    }

    const wr = await WithdrawRequest.create({
      userId,
      amount,
      remarks
    });

    // Optionally: lock the requested amount by reducing balance or setting a reservedBalance
    await Admin.findByIdAndUpdate(userId, { $inc: { balance: -amount, reservedBalance: amount } });

    res.status(HttpStatusCodes.CREATED).json(wr);
  } catch (err) { next(err); }
};

export const listWithdrawals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, status } = req.query;
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    const list = await WithdrawRequest.find(filter).populate("userId").sort({ createdAt: -1 });
    res.json({ total: list.length, list });
  } catch (err) { next(err); }
};

export const updateWithdrawStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const wr = await WithdrawRequest.findById(id);
    if (!wr) {
       res.status(404).json({ message: "Not found" });
       return
    }

    // Authorization: RM can act on their subordinates' requests (your logic), superadmin can on all
    //@ts-ignore
    const user = req.user;
    const isSuper = user?.role === "SUPERADMIN" || user?.role === "RM";
    // add RM checks as needed

    if (!isSuper) {
      res.status(403).json({ message: "Forbidden" });
      return
    }

    wr.status = status;
    wr.remarks = remarks || wr.remarks;
    if (status === "processed") {
      wr.processedAt = new Date();
      wr.processedBy = user.userId;
      // reduce reservedBalance and record transaction
      await Admin.findByIdAndUpdate(wr.userId, { $inc: { reservedBalance: -wr.amount } });
    } else if (status === "rejected") {
      // return money to balance
      await Admin.findByIdAndUpdate(wr.userId, { $inc: { balance: wr.amount, reservedBalance: -wr.amount } });
    }
    await wr.save();
    res.json(wr);
  } catch (err) { next(err); }
};
