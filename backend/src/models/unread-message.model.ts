import { Schema, model } from "mongoose";
import type { IUnreadMessage } from "../interfaces/unread-message/unread-message.interface.js";


const unreadMessageSchema = new Schema<IUnreadMessage>({
    user:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    },
    chat:{
        type:Schema.ObjectId,
        ref:"Chat",
        required:true
    },
    sender:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:Schema.ObjectId,
        ref:"Message",
        required:true
    },
    count:{
        type:Number,
        default:1
    },
    readAt:{
        type:Date,
    },
},{versionKey:false,timestamps:true})

export const UnreadMessage = model<IUnreadMessage>("UnreadMessage",unreadMessageSchema)