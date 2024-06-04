import { Schema, model } from "mongoose"
import { IPrivateKeyRecoveryToken } from "../interfaces/auth/auth.interface.js";
import { env } from "../schemas/env.schema.js";


const privateKeyRecoveryTokenSchema = new Schema<IPrivateKeyRecoveryToken>({

    user:{
        type:Schema.ObjectId,
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

},{versionKey:false,timestamps:false})

export const PrivateKeyRecoveryToken = model<IPrivateKeyRecoveryToken>("PrivateKeyRecoveryToken",privateKeyRecoveryTokenSchema)
