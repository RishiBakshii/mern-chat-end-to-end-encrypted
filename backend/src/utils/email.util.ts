import { transporter } from "../config/nodemailer.config.js"
import { otpVerificationBody, otpVerificationSubject, resetPasswordBody, resetPasswordSubject } from "../constants/email.constant.js"
import { env } from "../schemas/env.schema.js"

export const sendMail = async(to:string,username:string,type:"resetPassword" | "OTP",resetUrl?:string,otp?:string)=>{
    await transporter.sendMail({
        from:env.EMAIL, 
        to,
        subject:type==='resetPassword'?resetPasswordSubject:otpVerificationSubject,
        html:type==='resetPassword'?resetPasswordBody(username,resetUrl!):otpVerificationBody(username,otp!)
    })
}