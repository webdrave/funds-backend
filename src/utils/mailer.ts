const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();
// Define email template types
type EmailType = "adminCreation" | "resetPassword" | "notification" | "welcome" | "adminUpdation";

// Email sending configuration
interface EmailOptions {
  to: string;
  type: EmailType;
  subject?: string;
  additionalData?: Record<string, any>;
}

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
    case "adminCreation":
      return {
        subject: "Your Account Has Been Created",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Welcome to the Platform,</h2>
                        <p>Your account has been created by an administrator.</p>
                        <p>Here are your login details:</p>
                        <p><strong>Email:</strong> ${additionalData?.email || "N/A"
          }</p>
                        <p><strong>Password:</strong> ${additionalData?.password || "N/A"
          }</p>
                        <p><strong>Plan:</strong> ${additionalData?.plan || "N/A"
          }</p>
                        <p>Please login and change your password immediately.</p>
                        <p>If you have any questions, please contact support.</p>
                    </div>
                `,
      };
    case "adminUpdation":
      return {
        subject: "Your Account Has Been Updated",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2>Account Update Notification</h2>
            <p>Your admin account details have been updated by a superadmin.</p>
            <p><strong>Email:</strong> ${additionalData?.email || "N/A"}</p>
            <p><strong>Name:</strong> ${additionalData?.name || "N/A"}</p>
            <p><strong>Role:</strong> ${additionalData?.role || "N/A"}</p>
            <p><strong>Plan:</strong> ${additionalData?.plan || "N/A"}</p>
            <p>If you did not request this change or have questions, please contact support.</p>
          </div>
        `,
      };
    case "resetPassword":
      return {
        subject: "Password Reset Verification Code",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #333;">Password Reset Verification</h2>
                        </div>
                        <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <p>Hello ${additionalData?.name || ''},</p>
                            <p>We received a request to reset your password. To complete the password reset process, please use the verification code below:</p>
                            <div style="background-color: #f0f7ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
                                <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 3px; text-align: center; color: #0066cc;">${additionalData?.resetCode}</p>
                            </div>
                            <p><strong>Important:</strong> This code will expire in 15 minutes.</p>
                            <p>If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
                        </div>
                        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                `,
      };
    case "notification":
      return {
        subject: additionalData?.subject || "Notification",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2>Hello,</h2>
                        <p>${additionalData?.message ||
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
  additionalData,
}: EmailOptions): Promise<boolean> => {
  try {
    const emailContent = generateEmailContent(type, additionalData);

    const mailOptions = {
      from: `"${"System"}" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
