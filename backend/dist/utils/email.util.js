var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transporter } from "../config/nodemailer.config.js";
import { otpVerificationBody, otpVerificationSubject, resetPasswordBody, resetPasswordSubject } from "../constants/email.constant.js";
import { env } from "../schemas/env.schema.js";
export const sendMail = (to, username, type, resetUrl, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: env.EMAIL,
        to,
        subject: type === 'resetPassword' ? resetPasswordSubject : otpVerificationSubject,
        html: type === 'resetPassword' ? resetPasswordBody(username, resetUrl) : otpVerificationBody(username, otp)
    });
});
//# sourceMappingURL=email.util.js.map