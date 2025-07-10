import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prismaclient";
import { RouteError, ValidationErr } from "../common/routeerror";
import HttpStatusCodes from "../common/httpstatuscode";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/mailer";

const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await prisma.admin.findMany();
    res.status(HttpStatusCodes.OK).json(admins);
  } catch (error) {
    next(error);
  }
};
const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, type } = req.body;
    // Check if user already exists
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

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
    const user = await prisma.admin.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
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
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationErr("Email and password are required.");
    }

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "User not found.");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Invalid password.");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    // Return user info (excluding password) along with token
    const { id, name, email: userEmail, role } = user;
    res.status(HttpStatusCodes.OK).json({
      token,
      user: { id, name, email: userEmail, role },
    });
  } catch (error) {
    next(error);
  }
};
const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationErr("Admin ID is required.");
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "Admin not found.");
    }

    await prisma.admin.delete({
      where: { id },
    });

    res
      .status(HttpStatusCodes.OK)
      .json({ message: "Admin deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export default {
  getAdmins,
  createAdmin,
  login,
  deleteAdmin,
};
