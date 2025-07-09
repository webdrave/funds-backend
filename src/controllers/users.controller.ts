import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prismaclient";
import { ValidationErr } from "../common/routeerror";
import HttpStatusCodes from "../common/httpstatuscode";
const application = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      throw new ValidationErr("Name, email, phone, and message are required.");
    }
    const application = await prisma.application.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    res.status(HttpStatusCodes.CREATED).json(application);
  } catch (error) {
    next(error);
  }
};
const getApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applications = await prisma.application.findMany();
    res.status(HttpStatusCodes.OK).json(applications);
  } catch (error) {
    next(error);
  }
};
const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      throw new ValidationErr("Invalid status value.");
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    res.status(HttpStatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export default {
  application,
  getApplication,
  updateApplicationStatus
};
