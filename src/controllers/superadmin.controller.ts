import { Request, Response, NextFunction } from "express";
import { Admin, Application } from "../models";
import { RouteError, ValidationErr } from "../common/routeerror";
import HttpStatusCodes from "../common/httpstatuscode";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/mailer";

const getAdmins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const admins = await Admin.find();
    res.status(HttpStatusCodes.OK).json(admins);
  } catch (error) {
    next(error);
  }
};
const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, type } = req.body;
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      throw new RouteError(
        HttpStatusCodes.CONFLICT,
        "User with this email already exists."
      );
    }

    if (!name || !email || !password) {
      throw new ValidationErr("Name, email, and password are required.");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await Admin.create({
      name,
      email,
      role,
      password: hashedPassword,
    });
    await sendEmail({
      to: user.email,
      type: type,
      subject: "Welcome to Our Platform",
      additionalData: {
        email: user.email,
        password: password,
        role: user.role,
      },
    });

    res.status(HttpStatusCodes.CREATED).json({ user });
  } catch (error) {
    next(error);
  }
};
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationErr("Email and password are required.");
    }

    const user = await Admin.findOne({ email });

    if (!user || !user.password) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "User not found.");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Invalid password.");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    // Return user info (excluding password) along with token
    const { _id, name, email: userEmail, role } = user;
    res.status(HttpStatusCodes.OK).json({
      token,
      user: { id: _id, name, email: userEmail, role },
    });
  } catch (error) {
    next(error);
  }
};
const deleteAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationErr("Admin ID is required.");
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "Admin not found.");
    }

    await Admin.findByIdAndDelete(id);

    res
      .status(HttpStatusCodes.OK)
      .json({ message: "Admin deleted successfully." });
  } catch (error) {
    next(error);
  }
};
const application = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      throw new ValidationErr("Name, email, phone, and message are required.");
    }
    const application = await Application.create({
      name,
      email,
      phone,
      message,
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
): Promise<void> => {
  try {
    const applications = await Application.find();
    res.status(HttpStatusCodes.OK).json(applications);
  } catch (error) {
    next(error);
  }
};
const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      throw new ValidationErr("Invalid status value.");
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(HttpStatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export {
  getAdmins,
  createAdmin,
  login,
  deleteAdmin,
  application,
  getApplication,
  updateApplicationStatus
};
