import { Schema, model } from "mongoose";
import type { IUnreadMessage } from "../interfaces/unread-message.interface.js";


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
    count:{
        type:Number,
        required:true
    },
    readAt:{
        type:Date,
    },
},{versionKey:false,timestamps:true})

export const UnreadMessage = model<IUnreadMessage>("UnreadMessage",unreadMessageSchema)