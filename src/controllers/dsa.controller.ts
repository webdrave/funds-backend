import { Request, Response, NextFunction } from "express";
import { Admin, Bank } from "../models";

export const getDSAProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const userId = req.params.id;
		const user = await Admin.findById(userId).populate("bankDetails");
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const updateDSAProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const userId = req.params.id;

		// Extract bankDetails from request body
		const { bankDetails, ...adminUpdates } = req.body;

		// Get user profile
		const user = await Admin.findById(userId);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		// Update admin fields
		if (Object.keys(adminUpdates).length > 0) {
			await Admin.findByIdAndUpdate(userId, adminUpdates, { new: true });
		}

		// Update or create bank details
		if (bankDetails && Object.keys(bankDetails).length > 0) {
			if (user.bankDetails) {
				await Bank.findByIdAndUpdate(user.bankDetails, bankDetails, {
					new: true,
				});
			} else {
				const newBank = await Bank.create(bankDetails);
				await Admin.findByIdAndUpdate(
					userId,
					{ bankDetails: newBank._id },
					{ new: true }
				);
			}
		}

		const updatedUser = await Admin.findById(userId).populate("bankDetails");
		res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};
