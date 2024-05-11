import { Schema, model } from "mongoose";
import type { IResetPassword } from "../interfaces/auth/auth.interface.js";
import { env } from "../schemas/env.schema.js";

const resetPasswordSchema = new Schema<IResetPassword>({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    hashedToken:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        default:()=>new Date(Date.now() + (parseInt(env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES)*60*1000))
    }
},{versionKey:false})

export const ResetPassword = model<IResetPassword>("Reset-Password",resetPasswordSchema)