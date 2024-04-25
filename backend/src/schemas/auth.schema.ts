import { z } from "zod";

const passwordValidation = z.string({required_error:"Password is required"}).min(8,'Password cannot be shorter than 8 characters').max(40,'Password cannot be longer than 30 characters')
.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,'Password must contain 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number')

export const signupSchema = z.object({
    name:z.string({required_error:"name is required"}).min(3,'name cannot be shorter than 3 characters').max(20,"name cannot be longer than 20 characters"),
    username:z.string({required_error:"username is required"}).min(3,'username cannot be shorter than 3 characters').max(20,"username cannot be longer than 20 characters"),
    email:z.string({required_error:"Email is required"}).regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'Please enter a valid email'),
    password:passwordValidation
})

export const loginSchema = z.object({
    email:z.string({required_error:"Email is required"}),
    password:z.string({required_error:"Password is required"}),
})

export const forgotPasswordSchema = z.object({
    email:z.string({required_error:"Email is required for sending password reset link"})
})

export const resetPasswordSchema = z.object({
    token:z.string({required_error:"password reset token is required"}),
    userId:z.string({required_error:"userid is required"}),
    newPassword:passwordValidation
})

export const verifyOtpSchema = z.object({
    otp:z.string({required_error:"otp is required"})
})

export type signupSchemaType = z.infer<typeof signupSchema>
export type loginSchemaType = z.infer<typeof loginSchema>
export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
export type verifyOtpSchemaType = z.infer<typeof verifyOtpSchema>
