import { Request, Response, NextFunction } from "express";
import { Notification } from "../models";
import { sendNotification } from "../utils/notifier";

export const getNotifications = async (req: Request, res: Response) => {
	const { userId } = req.query;
	const filter = userId ? { userId } : {};
	const notifications = await Notification.find(filter).sort({ createdAt: -1 });
	res.json(notifications);
};

export const createNotification = async (req: Request, res: Response) => {
	const { title, message, userId } = req.body;
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
		const notification = await Notification.findByIdAndDelete(id);
		if (!notification) {
			res.status(404).json({ message: "Notification not found" });
			return;
		}
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
