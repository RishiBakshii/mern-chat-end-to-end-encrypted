import { transporter } from "../config/nodemailer.config.js";
import { otpVerificationBody, otpVerificationSubject, resetPasswordBody, resetPasswordSubject } from "../constants/email.constant.js";
import { env } from "../schemas/env.schema.js";
export const sendMail = async (to, username, type, resetUrl, otp) => {
    await transporter.sendMail({
        from: env.EMAIL,
        to,
        subject: type === 'resetPassword' ? resetPasswordSubject : otpVerificationSubject,
        html: type === 'resetPassword' ? resetPasswordBody(username, resetUrl) : otpVerificationBody(username, otp)
    });
};
