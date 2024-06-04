import { transporter } from "../config/nodemailer.config.js"
import { otpVerificationBody, otpVerificationSubject, privateKeyRecoveryBody, privateKeyRecoverySubject, resetPasswordBody, resetPasswordSubject } from "../constants/email.constant.js"
import { env } from "../schemas/env.schema.js"

export const sendMail = async(to:string,username:string,type:"resetPassword" | "OTP" | "privateKeyRecovery",resetUrl?:string,otp?:string,verificationUrl?:string)=>{
    await transporter.sendMail({
        from:env.EMAIL, 
        to,
        subject:type==='OTP'?otpVerificationSubject:type==='resetPassword'?resetPasswordSubject:privateKeyRecoverySubject,
        html:type==='OTP'?otpVerificationBody(username,otp!):type==='resetPassword'?resetPasswordBody(username,resetUrl!):privateKeyRecoveryBody(username,verificationUrl!),
    })
}