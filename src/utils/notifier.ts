import { Notification, Admin } from "../models";
import { sendEmail } from "./mailer";

export const sendNotification = async (data: {
	userId: string;
	title: string;
	message: string;
}): Promise<typeof Notification> => {
	if (!data.userId || !data.title || !data.message) {
		throw new Error("Invalid notification data");
	}
	try {
		const notification = await Notification.create({ ...data, read: false });
		const admin = await Admin.findById(data.userId);
		if (!admin) {
			throw new Error("Admin not found");
		}

		// Send email notification
		await sendEmail({
			to: admin.email,
			type: "notification",
			subject: data.title,
			additionalData: {
				message: data.message,
			},
		});

		return notification;
	} catch (error) {
		console.error("Error sending notification:", error);
		throw new Error("Failed to send notification");
	}
};
