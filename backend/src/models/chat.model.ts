import { Schema, model } from "mongoose";
import type { IChat } from "../interfaces/chat.interface.js";


const chatSchema = new Schema<IChat>({
    name:{
        type:String,
        required:true
    },
    isGroupChat:{
        type:Boolean,
        required:true
    },
    members:{
        type:[
            {
                type:Schema.ObjectId,
                ref:"User"
            }
        ],
        required:true
    },
    avatar:{
        type:String,
        unique:true,
        required:true
    },
},{versionKey:false,timestamps:true})

export const Chat = model<IChat>("Chat",chatSchema)