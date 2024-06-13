import { Schema, model } from "mongoose";
import type { IUser } from "../interfaces/auth/auth.interface.js";


const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true,
        index:true
    },
    avatar:{
        secureUrl:{
            type:String
        },
        publicId:{
            type:String
        }
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    },
    fcmToken:{
        type:String,
    },
    notificationsEnabled:{
        type:Boolean,
        default:false
    },
    publicKey:{
        type:String,
        unique:true
    },
    privateKey:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        select:false,
        required:true
    },
    lastSeen:{
        type:Date
    },
    verified:{
        type:Boolean,
        default:false
    },
    verificationBadge:{
        type:Boolean,
        default:false
    },
    googleId:{
        type:String
    },
    oAuthSignup:{
        type:Boolean
    }
},{versionKey:false,timestamps:true})

export const User = model<IUser>("User",userSchema)