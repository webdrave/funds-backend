import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prismaclient";
import { RouteError, ValidationErr } from "../common/routeerror";
import HttpStatusCodes from "../common/httpstatuscode";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/mailer";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role,type } = req.body;
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
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
    const user = await prisma.user.create({
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

    const user = await prisma.user.findUnique({
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

export default {
  createUser,
  login,
};
