import { Request, Response, NextFunction } from "express";
import { Admin, Plan } from "../models";

export const getDSAProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const userId = req.params.id;
		const user = await Admin.findById(userId);
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
        const updates = req.body;
        console.log("Updates received:", updates);

        const user = await Admin.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
