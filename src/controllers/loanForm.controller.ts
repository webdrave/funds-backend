import { Request, Response } from "express";
import { Loan, LoanFormTemplate, LoanMessage } from "../models";
import { ILoanFormTemplate } from "../models"; // adjust path if needed

export const createLoan = async (req: Request, res: Response) => {
  try {
    const {
      formData,
      subscriber,
      loanType,
      loanSubType,
      templateId,
      dsaId,
      rmId,
    } = req.body;

    if (!templateId) {
      res.status(400).json({ message: "templateId is required" });
      return;
    }

    const template: ILoanFormTemplate | null = await LoanFormTemplate.findById(
      templateId
    );
    if (!template) {
      res.status(404).json({ message: "Loan form template not found" });
      return;
    }

    const structuredValues = template.pages.map((page) => ({
      pageNumber: page.pageNumber,
      title: page.title,
      fields: page.fields.map((field) => ({
        label: field.label,
        value: formData[field.label] ?? null,
        isDocument: field.type === "document",
      })),
    }));

    const submission = await Loan.create({
      values: structuredValues,
      subscriber,
      loanType,
      loanSubType,
      dsaId,
      rmId,
    });

    res.status(201).json(submission);
  } catch (err: any) {
    console.error("Error creating loan:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLoans = async (req: Request, res: Response) => {
  try {
    const {
      loanType,
      status,
      search = "",
      page = 1,
      limit = 10,
    } = req.query as {
      loanType?: string;
      status?: string;
      search?: string;
      page?: string | number;
      limit?: string | number;
    };

    const filter: any = {};

    // Loan type filtering
    if (loanType && loanType !== "") {
      filter.loanType = loanType;
    } else {
      filter.loanType = { $nin: ["quick", "taxation"] }; // default exclusion
    }

    // Status filtering
    if (status && status !== "all") {
      filter.status = status;
    }

    // Search by name or email
    if (search.trim()) {
      filter["values.fields"] = {
        $elemMatch: {
          label: { $in: ["Name", "Email"] },
          value: { $regex: new RegExp(search, "i") },
        },
      };
    }

    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Loan.countDocuments(filter);

    //@ts-ignore
    const userId = req.user?._id;
    const unreadCounts = await LoanMessage.aggregate([
      { $match: { readBy: { $nin: [userId] } } },
      { $group: { _id: "$loanId", count: { $sum: 1 } } },
    ]);

    const unreadMap = unreadCounts.reduce((acc, cur) => {
      acc[cur._id.toString()] = cur.count;
      return acc;
    }, {} as Record<string, number>);

    const loans = await Loan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    const enrichedLoans = loans.map((loan) => ({
      ...loan.toObject(),
      unreadCount: unreadMap[loan._id.toString()] || 0,
    }));

    res.json({ total, loans:enrichedLoans, page: pageNum, limit: limitNum });
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLoanPendingCounts = async (req: Request, res: Response) => {
  try {
    const getPendingCount = async (filter: any) =>
      await Loan.countDocuments({ ...filter, status: "pending" });

    const [normal, quick, taxation] = await Promise.all([
      getPendingCount({ loanType: { $nin: ["quick", "taxation"] } }),
      getPendingCount({ loanType: "quick" }),
      getPendingCount({ loanType: "taxation" }),
    ]);

    res.json({
      applications: normal,
      quickApplications: quick,
      taxApplications: taxation,
    });
  } catch (err) {
    console.error("Error fetching pending counts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryName = (loanType: string) => {
  switch (loanType?.toLowerCase()) {
    case "private":
      return "Private Loan";
    case "government":
      return "Government Loan";
    case "insurance":
      return "Insurance";
    default:
      return "Private Loan";
  }
};
// GET /loan-forms/stats
export const getLoanStats = async (req: Request, res: Response) => {
  try {
    const stats = await Loan.aggregate([
      {
        $group: {
          _id: { loanType: "$loanType", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);
    const formatted: Record<string, any> = {};
    stats.forEach((s) => {
      const cat = getCategoryName(s._id.loanType);
      formatted[cat] ??= { total: 0, approved: 0, pending: 0, rejected: 0 };
      formatted[cat].total += s.count;
      formatted[cat][s._id.status] = s.count;
    });
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getLoanByRmId = async (req: Request, res: Response) => {
  try {
    const { rmId } = req.params;
    if (!rmId) {
      res.status(400).json({ message: "RM ID is required" });
      return;
    }
    const loans = await Loan.find({ rmId }).lean();

    for (const loan of loans) {
      //readby is an array of user ids
      loan.unreadCount = await LoanMessage.countDocuments({
        loanId: loan._id, readBy: { $nin: [rmId] },
      });
    }
    res.json(loans);
  } catch (err) {
    console.error("Error fetching loans by RM ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLoanByDsaId = async (req: Request, res: Response) => {
  try {
    const { dsaId } = req.params;
    if (!dsaId) {
      res.status(400).json({ message: "DSA ID is required" });
      return;
    }
    const loans = await Loan.find({ dsaId }).lean();
    for (const loan of loans) {
      //readby is an array of user ids
      loan.unreadCount = await LoanMessage.countDocuments({ loanId: loan._id, readBy: { $nin: [dsaId] }, });
    }
    res.json(loans);
  } catch (err) {
    console.error("Error fetching loans by DSA ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLoan = async (req: Request, res: Response) => {
  try {
    const { _id, status, rejectionMessage } = req.body;

    if (!_id || !status || !["approved", "rejected"].includes(status)) {
      res
        .status(400)
        .json({ message: "Invalid request: id and valid status required." });
      return;
    }

    const update: any = { status };
    if (status === "rejected") {
      update.rejectionMessage = rejectionMessage || "";
    } else if (status === "approved") {
      update.rejectionMessage = undefined;
    }

    const updatedLoan = await Loan.findByIdAndUpdate(_id, update, {
      new: true,
    });

    if (!updatedLoan) {
      res.status(404).json({ message: "Loan not found" });
      return;
    }

    res.json(updatedLoan);
  } catch (err) {
    console.error("Error updating loan:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
