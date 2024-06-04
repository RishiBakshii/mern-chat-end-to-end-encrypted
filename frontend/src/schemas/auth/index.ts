import { z } from "zod";

const passwordValidation = z.string({required_error:"Password is required"}).min(8,'Password cannot be shorter than 8 characters').max(40,'Password cannot be longer than 30 characters')
.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,'Password must contain 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number')

const emailValidation = z.string({required_error:"Email is required"}).regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'Please enter a valid email')

const signupSchema = z.object({
    name:z.string({required_error:"name is required"}).min(3,'name cannot be shorter than 3 characters').max(20,"name cannot be longer than 20 characters"),
    username:z.string({required_error:"username is required"}).min(3,'username cannot be shorter than 3 characters').max(20,"username cannot be longer than 20 characters"),
    email:emailValidation,
    password:passwordValidation,
    confirmPassword:z.string()
}).refine(({password,confirmPassword})=>password===confirmPassword,{message:"Passwords doesn't match",path:['confirmPassword']})

const loginSchema = z.object({
    email:z.string({required_error:"Email is required"}).email({message:"Please enter a valid email"}),
    password:z.string().min(8,'Password cannot be shorter than 8 characters').max(40,'Password cannot be longer than 30 characters')
})

const forgotPasswordSchema = z.object({
    email:emailValidation
})

const resetPasswordSchema = z.object({
    newPassword:passwordValidation,
    confirmPassword:z.string({required_error:"Confirm password is required"})
}).refine(({newPassword,confirmPassword})=>newPassword===confirmPassword,{message:"Passwords dosen't match",path:['confirmPassword']})

const otpVerificationSchema = z.object({
    otp:z.string({required_error:"Otp is required"}).min(4,{message:"OTP must be a minimum of 4 digits"})
})

const keyRecoverySchema = z.object({
    password:passwordValidation
})

export {
    loginSchema,
    signupSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    otpVerificationSchema,
    keyRecoverySchema,
}

export type signupSchemaType = z.infer<typeof signupSchema>
export type loginSchemaType = z.infer<typeof loginSchema>
export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
export type otpVerificationSchemaType = z.infer<typeof otpVerificationSchema>
export type keyRecoverySchemaType = z.infer<typeof keyRecoverySchema>