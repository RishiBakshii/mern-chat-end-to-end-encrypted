import { Schema, model } from "mongoose";
import type { IMessage } from "../interfaces/message.interface.js";


const messageSchema = new Schema<IMessage>({
    content:{
        type:String,
        required:true
    },
    sender:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    },
    chat:{
        type:Schema.ObjectId,
        ref:"Chat",
        required:true
    },
    attachments:{
        type:[String],
    },
},{versionKey:false,timestamps:true})

export const Message = model<IMessage>("Message",messageSchema)