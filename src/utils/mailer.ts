const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();
// Define email template types
type EmailType = "userCreation" | "resetPassword" | "notification" | "welcome";

// Email sending configuration
interface EmailOptions {
  to: string;
  type: EmailType;
  subject?: string;
  additionalData?: Record<string, any>;
}

console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

// Create transport with environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate HTML content based on email type
const generateEmailContent = (
  type: EmailType,
  additionalData?: Record<string, any>
): { subject: string; html: string } => {
  switch (type) {
    case "userCreation":
      return {
        subject: "Your Account Has Been Created",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Welcome to the Platform,</h2>
                        <p>Your account has been created by an administrator.</p>
                        <p>Here are your login details:</p>
                        <p><strong>Email:</strong> ${
                          additionalData?.email || "N/A"
                        }</p>
                        <p><strong>Password:</strong> ${
                          additionalData?.password || "N/A"
                        }</p>
                        <p>Please login and change your password immediately.</p>
                        <p>If you have any questions, please contact support.</p>
                    </div>
                `,
      };
    case "resetPassword":
      return {
        subject: "Password Reset Request",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Hello,</h2>
                        <p>We received a request to reset your password.</p>
                        <p>Click the link below to reset your password:</p>
                        <p><a href="${additionalData?.resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                `,
      };
    case "notification":
      return {
        subject: additionalData?.subject || "Notification",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Hello,</h2>
                        <p>${
                          additionalData?.message ||
                          "You have a new notification."
                        }</p>
                    </div>
                `,
      };
    case "welcome":
      return {
        subject: "Welcome to Our Platform",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Welcome,!</h2>
                        <p>Thank you for joining our platform. We're excited to have you on board.</p>
                        <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
                    </div>
                `,
      };
    default:
      return {
        subject: "Information",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Hello,</h2>
                        <p>This is an automated email from our system.</p>
                    </div>
                `,
      };
  }
};

// Send email function
export const sendEmail = async ({
  to,
  type,
  subject,
  additionalData,
}: EmailOptions): Promise<boolean> => {
  try {
    const emailContent = generateEmailContent(type, additionalData);

    const mailOptions = {
      from: `"${"System"}" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || emailContent.subject,
      html: emailContent.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
