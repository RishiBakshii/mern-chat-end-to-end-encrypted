import { transporter } from "../config/nodemailer.config.js"
import { resetPasswordBody, resetPasswordSubject } from "../constants/email.constant.js"
import { env } from "../schemas/env.schema.js"

export const sendMail = async(to:string,username:string,resetUrl:string,type:"resetPassword" | "OTP")=>{
    await transporter.sendMail({
        from:env.EMAIL, 
        to,
        subject:type==='resetPassword'?resetPasswordSubject:"",
        html:type==='resetPassword'?resetPasswordBody(username,resetUrl):""
    })
}