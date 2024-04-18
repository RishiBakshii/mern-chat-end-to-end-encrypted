import { Schema, model } from "mongoose";
import type { IUser } from "../interfaces/user.interface.js";


const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        select:false,
        required:true
    }
},{versionKey:false,timestamps:true})

export const User = model<IUser>("User",userSchema)