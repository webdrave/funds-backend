import { Request, Response } from "express";
import { Loan } from "../models";
import { Admin } from "../models";
import { startOfWeek, endOfWeek, subDays, subWeeks, format, getWeek, getYear } from "date-fns";

export const getLoanDsaActivityStats = async (req: Request, res: Response) => {
  try {
    const mode = req.query.mode === "weekly" ? "weekly" : "daily";

    const today = new Date();

    const baseFilter = {
      createdAt: { $exists: true },
      dsaId: { $exists: true, $ne: null },
    };

    let matchFilter: any;
    let targetDates: string[] = [];

    if (mode === "daily") {
      const days: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        days.push(format(date, "yyyy-MM-dd"));
      }
      targetDates = days;

      matchFilter = {
        ...baseFilter,
        createdAt: {
          $gte: subDays(today, 6),
          $lte: today,
        },
      };

      const rawData = await Loan.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            totalLoans: { $sum: 1 },
            dsaIds: { $addToSet: "$dsaId" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            totalLoans: 1,
            activeDSAs: { $size: "$dsaIds" },
          },
        },
      ]);

      const mapped = new Map(rawData.map((d) => [d.date, d]));
      const filled = targetDates.map((date) => ({
        date,
        totalLoans: mapped.get(date)?.totalLoans || 0,
        activeDSAs: mapped.get(date)?.activeDSAs || 0,
      }));

      return res.json(filled);
    }

    // Weekly mode
    const weeks: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
      const week = getWeek(weekStart);
      const year = getYear(weekStart);
      weeks.push(`${week}W${year}Y`);
    }
    targetDates = weeks;

    matchFilter = {
      ...baseFilter,
      createdAt: {
        $gte: startOfWeek(subWeeks(today, 6), { weekStartsOn: 1 }),
        $lte: endOfWeek(today, { weekStartsOn: 1 }),
      },
    };

    const rawData = await Loan.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalLoans: { $sum: 1 },
          dsaIds: { $addToSet: "$dsaId" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: "$_id.week" },
              "W",
              { $toString: "$_id.year" },
              "Y",
            ],
          },
          totalLoans: 1,
          activeDSAs: { $size: "$dsaIds" },
        },
      },
    ]);

    const mapped = new Map(rawData.map((d) => [d.date, d]));
    const filled = targetDates.map((date) => ({
      date,
      totalLoans: mapped.get(date)?.totalLoans || 0,
      activeDSAs: mapped.get(date)?.activeDSAs || 0,
    }));

    return res.json(filled);
  } catch (err) {
    console.error("Error generating loan/dsa stats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getPlanPopularityStats = async (req: Request, res: Response) => {
  try {
    const result = await Admin.aggregate([
      {
        $match: {
          isDeleted: false,
          planId: { $exists: true, $ne: null },
          planName: { $exists: true, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$planName",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          planName: "$_id",
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching plan popularity stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopUsersStats = async (req: Request, res: Response) => {
  try {
    const mode = req.query.mode === "rm" ? "rm" : "dsa"; // default to DSA

    if (mode === "dsa") {
      const topDSAs = await Loan.aggregate([
        { $match: { dsaId: { $ne: null } } },
        {
          $group: {
            _id: "$dsaId",
            loanCount: { $sum: 1 },
          },
        },
        { $sort: { loanCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "admins",
            localField: "_id",
            foreignField: "_id",
            as: "dsa",
          },
        },
        { $unwind: "$dsa" },
        {
          $project: {
            _id: "$dsa._id",
            name: "$dsa.name",
            email: "$dsa.email",
            planName: "$dsa.planName",
            loanCount: 1,
          },
        },
      ]);

      return res.json({
        mode: "dsa",
        topDSAs: topDSAs.map((item, idx) => ({
          rank: idx + 1,
          ...item,
        })),
      });
    }

    // mode === "rm"
    const topRMs = await Loan.aggregate([
      { $match: { rmId: { $ne: null } } },
      {
        $group: {
          _id: "$rmId",
          loanCount: { $sum: 1 },
          dsaAssigned: { $addToSet: "$dsaId" },
        },
      },
      {
        $addFields: {
          dsaAssignedCount: { $size: "$dsaAssigned" },
        },
      },
      { $sort: { loanCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "_id",
          as: "rm",
        },
      },
      { $unwind: "$rm" },
      {
        $project: {
          _id: "$rm._id",
          name: "$rm.name",
          email: "$rm.email",
          loanCount: 1,
          dsaAssignedCount: 1,
        },
      },
    ]);

    return res.json({
      mode: "rm",
      topRMs: topRMs.map((item, idx) => ({
        rank: idx + 1,
        ...item,
      })),
    });
  } catch (error) {
    console.error("Error fetching top user stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
