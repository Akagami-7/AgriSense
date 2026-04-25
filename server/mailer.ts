import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App password
    },
});

export const sendOTP = async (to: string, otp: string) => {
    const mailOptions = {
        from: `"AgriSense Authentication" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your AgriSense Login Code",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center;">
        <h1 style="color: #2F8A5A;">AgriSense</h1>
        <p style="font-size: 16px; color: #4A4A4A;">Use the secure code below to sign in or create your account.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #F8FAF8; border-radius: 8px;">
          <h2 style="font-size: 32px; letter-spacing: 4px; color: #164E33; margin: 0;">${otp}</h2>
        </div>
        <p style="font-size: 14px; color: #7F7F7F;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};
