import { Request, Response, NextFunction } from "express";
import { Admin, Plan } from "../models";
import { RouteError, ValidationErr } from "../common/routeerror";
import HttpStatusCodes from "../common/httpstatuscode";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/mailer";
import crypto from "crypto";

const getAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admins = await Admin.find();
    res.status(HttpStatusCodes.OK).json(admins);
  } catch (error) {
    next(error);
  }
};
const getAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ValidationErr("Admin ID is required.");
    }
    const admin = await Admin.findById(id);
    res.status(HttpStatusCodes.OK).json(admin);
  } catch (error) {
    next(error);
  }
};
const getUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.params;
    const users = await Admin.find({ role });
    res.status(HttpStatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};
const getDsasByRmId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rmId } = req.params;
    const dsas = await Admin.find({ rmId });
    res.status(HttpStatusCodes.OK).json(dsas);
  } catch (error) {
    next(error);
  }
};
const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, type, planId, rmId } = req.body;
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser && !existingUser.isDeleted) {
      throw new RouteError(
        HttpStatusCodes.CONFLICT,
        "User with this email already exists."
      );
    }

    if (!name || !email || !password || !planId) {
      throw new ValidationErr(
        "Name, email, password, and planId are required."
      );
    }

    // If role is DSA, rmId is required
    if (role === "DSA" && !rmId) {
      throw new ValidationErr("RM ID is required for DSA accounts.");
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new ValidationErr("Invalid plan.");
    }

    // If rmId is provided, verify that the RM exists
    if (rmId) {
      const rmAdmin = await Admin.findOne({ _id: rmId, role: "RM" });
      if (!rmAdmin) {
        throw new ValidationErr("Invalid RM ID or the user is not an RM.");
      }
    }

    async function generateUniqueCode() {
      let code;
      let exists = true;

      while (exists) {
        code = String(Math.floor(100000 + Math.random() * 900000));
        exists = !!(await Admin.findOne({ dsaCode: code }));
      }

      return code;
    }

    // Generate DSA code only if the role is DSA
    let dsaCode;
    if (role === "DSA") {
      dsaCode = await generateUniqueCode();
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // Create user object based on role
    const userData: any = {
      name,
      email,
      role,
      password: hashedPassword,
      planId: plan._id,
      planName: plan.name,
      features: plan.features,
    };

    // Add DSA code and RM ID only if the role is DSA
    if (role === "DSA") {
      userData.dsaCode = dsaCode;
      userData.rmId = rmId;
    }

    const user = await Admin.create(userData);
    // Prepare email data based on role
    const emailData: any = {
      email: user.email,
      password: password,
      role: user.role,
      plan: plan.name,
    };

    // Add DSA code to email data if the role is DSA
    if (user.role === "DSA" && user.dsaCode) {
      emailData.dsaCode = user.dsaCode;
    }

    await sendEmail({
      to: user.email,
      type: type,
      additionalData: emailData,
    });

    res.status(HttpStatusCodes.CREATED).json({ user });
  } catch (error) {
    next(error);
  }
};
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationErr("Email and password are required.");
    }

    const user = await Admin.findOne({ email });

    if (!user || !user.password || user.isDeleted) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "User not found.");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Invalid password.");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret"
    );

    // Return user info (excluding password) along with token
    const {
      _id,
      name,
      email: userEmail,
      role,
      features,
      planId,
      planName,
      rmId
    } = user;
    res.status(HttpStatusCodes.OK).json({
      token,
      user: {
        id: _id,
        name,
        email: userEmail,
        role,
        features,
        planId,
        planName,
        rmId
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationErr("Admin ID is required.");
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "Admin not found.");
    }

    await Admin.findByIdAndUpdate(id, { isDeleted: true });

    res
      .status(HttpStatusCodes.OK)
      .json({ message: "Admin deleted successfully." });
  } catch (error) {
    next(error);
  }
};
const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, planId, type } = req.body;
    if (!id) {
      throw new ValidationErr("Admin ID is required.");
    }
    const update: any = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role;
    if (planId) {
      const plan = await Plan.findById(planId);
      if (!plan) {
        throw new ValidationErr("Invalid plan.");
      }
      update.planId = plan._id;
      update.planName = plan.name;
      update.features = plan.features;
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedAdmin) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "Admin not found.");
    }
    await sendEmail({
      to: updatedAdmin.email,
      type: type,
      additionalData: {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        plan: updatedAdmin.planName,
      },
    });
    res.status(HttpStatusCodes.OK).json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    console.log("Requesting password reset for:", email);

    if (!email) {
      throw new ValidationErr("Email is required.");
    }

    const user = await Admin.findOne({ email, isDeleted: false });

    if (!user) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, "User not found.");
    }
    const resetCode = crypto.randomInt(100000, 999999).toString();

    const resetExpires = new Date();
    resetExpires.setMinutes(resetExpires.getMinutes() + 15);

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    await sendEmail({
      to: user.email,
      type: "resetPassword",
      additionalData: {
        name: user.name,
        email: user.email,
        resetCode,
      },
    });

    res.status(HttpStatusCodes.OK).json({
      message:
        "Password reset code sent to your email. Code will expire in 15 minutes.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyCodeAndResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      throw new ValidationErr(
        "Email, reset code, and new password are required."
      );
    }

    const user = await Admin.findOne({
      email,
      isDeleted: false,
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        "Invalid or expired reset code."
      );
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(HttpStatusCodes.OK).json({
      message: "Password reset successful.",
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAdmins,
  getAdmin,
  createAdmin,
  getDsasByRmId,
  login,
  deleteAdmin,
  updateAdmin,
  requestPasswordReset,
  getUsersByRole,
  verifyCodeAndResetPassword,
};
