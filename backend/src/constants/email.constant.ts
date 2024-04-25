import { env } from "../schemas/env.schema.js"

export const resetPasswordSubject = "Reset Your Password for [Your Application Name]"

export const resetPasswordBody=(username:string,resetUrl:string)=>{
    return `
    Hi ${username},

    We received a request to reset your password for your account on [Your Application Name].

    If you requested this password reset, please click the link below to create a new password:

    Reset Password Link: ${resetUrl}

    This link will expire in ${env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES} minutes.

    If you didn't request a password reset, you can safely ignore this email. However, we recommend that you change your password periodically to maintain the security of your account.

    Sincerely,

    The [Your Application Name] Team
    `
}

export const otpVerificationSubject = "Verify Your Email Address for [Your App Name]"

export const otpVerificationBody = (username:string,otp:string)=>{
    return `
    Hi ${username},

    Thanks for signing up for [Your App Name]!

    To complete your registration, please verify your email address by entering the following OTP (one-time password) within ${env.OTP_EXPIRATION_MINUTES} minutes:

    **${otp}**

    If you didn't request this email, please ignore it.

    Thanks,

    The [Your App Name] Team
    `
}