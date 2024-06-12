import { transporter } from "../config/nodemailer.config.js"
import { otpVerificationBody, privateKeyRecoveryBody,resetPasswordBody, welcomeEmailBody } from "../constants/emails/email.body.js"
import { otpVerificationSubject, privateKeyRecoverySubject, resetPasswordSubject, welcomeEmailSubject } from "../constants/emails/email.subject.js"
import type { EmailType } from "../interfaces/email/email.interface.js"
import { env } from "../schemas/env.schema.js"

export const sendMail = async(to:string,username:string,type:EmailType,resetUrl?:string,otp?:string,verificationUrl?:string)=>{
    await transporter.sendMail({
        from:env.EMAIL, 
        to,
        subject:type==='OTP'?otpVerificationSubject:type==='resetPassword'?resetPasswordSubject:type==='welcome'?welcomeEmailSubject:privateKeyRecoverySubject,
        html:type==='OTP'?otpVerificationBody(username,otp!):type==='resetPassword'?resetPasswordBody(username,resetUrl!):type==='welcome'?welcomeEmailBody(username):privateKeyRecoveryBody(username,verificationUrl!),
    })
}