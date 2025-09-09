import { Request, Response, NextFunction } from "express";
import { LoanMessage, Loan, Admin } from "../models";

/**
 * POST /api/loan-chats
 * body: { loanId, message, type, attachments?: [] }
 * - sender inferred from req.user (if present) otherwise accept senderName/senderRole in body
 */
export const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      loanId,
      message,
      attachments = [],
      senderName,
      senderRole,
      type = "text",
    } = req.body;

    if (!loanId || !message) {
       res.status(400).json({ message: "loanId and message are required." });
       return
    }

    if (!["text", "photo", "document"].includes(type)) {
       res.status(400).json({ message: "Invalid message type." });
       return
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {res.status(404).json({ message: "Loan not found." }); return};

    // @ts-ignore
    const user = req.user;

    const payload: any = {
      loanId,
      message,
      attachments,
      type,
    };

    if (user && user.userId) {
      payload.senderId = user.userId;
      payload.senderRole = user.role || undefined;

      const admin = await Admin.findById(user.userId).select("name");
      if (admin) payload.senderName = admin.name;
    } else {
      if (senderName) payload.senderName = senderName;
      if (senderRole) payload.senderRole = senderRole;
    }

    const lm = await LoanMessage.create(payload);

    res.status(201).json(lm);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/loan-chats/:loanId
 * query: page, limit
 */
export const getMessagesByLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loanId } = req.params;
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const limit = Math.max(1, parseInt((req.query.limit as string) || "50", 10));
    const skip = (page - 1) * limit;

    if (!loanId) {res.status(400).json({ message: "loanId is required" }); return;}

    const total = await LoanMessage.countDocuments({ loanId });
    const messages = await LoanMessage.find({ loanId })
      .sort({ createdAt: 1 }) // oldest first
      .skip(skip)
      .limit(limit)
      .populate({ path: "senderId", select: "name email role" });

    res.json({ total, page, limit, messages });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/loan-chats/:loanId/mark-read
 * body: { userId } or if auth middleware present, will use req.user
 */
export const markLoanMessagesRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loanId } = req.params;
    if (!loanId) {res.status(400).json({ message: "loanId required" }); return;}

    // @ts-ignore
    const user = req.user;
    const userId = user?.userId || req.body.userId;
    if (!userId) {res.status(400).json({ message: "userId or auth required" }); return;}

    await LoanMessage.updateMany(
      { loanId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
