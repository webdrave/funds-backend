import { Request, Response, NextFunction } from "express";
import { Notification, Admin } from "../models";
import { sendNotification } from "../utils/notifier";

export const getNotifications = async (req: Request, res: Response) => {
	try {
		const { userId, page = "1", limit = "10" } = req.query;

		const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
		const filter = userId ? { userId, isDeleted: { $ne: true } } : { isDeleted: { $ne: true } };

		const [notifications, total] = await Promise.all([
			Notification.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit as string)),
			Notification.countDocuments(filter),
		]);

		res.json({
			notifications,
			total,
			page: parseInt(page as string),
			limit: parseInt(limit as string),
		});
	} catch (error) {
		console.error("Failed to fetch notifications", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const createNotification = async (req: Request, res: Response) => {
	const { title, message, userId } = req.body;
	const notification = await sendNotification({ title, message, userId });
	res.status(201).json(notification);
};

export const notifySuperAdmin = async (req: Request, res: Response) => {
	const { title, message } = req.body;
	const superadmin = await Admin.findOne({ role: "SUPERADMIN" }).select("_id");
	const userId = superadmin?._id?.toString();
	if (!userId) {
		res.status(404).json({ message: "Superadmin not found" });
		return;
	}
	const notification = await sendNotification({ title, message, userId });
	res.status(201).json(notification);
};

export const markAsRead = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const notification = await Notification.findByIdAndUpdate(id, {
			read: true,
		});
		if (!notification) {
			res.status(404).json({ message: "Notification not found" });
			return;
		}
		res.status(200).json({ success: true });
	} catch (err) {
		next(err);
	}
};

export const deleteNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const notification = await Notification.findByIdAndUpdate(id, { isDeleted: true });
		if (!notification) {
			res.status(404).json({ message: "Notification not found" });
			return;
		}
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
