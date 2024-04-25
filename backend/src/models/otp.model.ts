import { Schema, model } from "mongoose";
import type { IOtp } from "../interfaces/otp.interface.js";
import { env } from "../schemas/env.schema.js";

const otpSchema = new Schema<IOtp>({
    hashedOtp:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    expiresAt:{
        type:Date,
        default:()=>new Date(Date.now() + (parseInt(env.OTP_EXPIRATION_MINUTES)*60*1000))
    }
},{versionKey:false})

export const Otp = model<IOtp>("Otp",otpSchema)