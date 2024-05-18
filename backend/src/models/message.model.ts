import { Schema, model } from "mongoose";
import type { IMessage } from "../interfaces/message/message.interface.js";


const messageSchema = new Schema<IMessage>({
    content:{
        type:String,
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
        type:[
            {
                secureUrl:String,
                publicId:String
            }
        ],
    },
    url:{
        type:String
    }
},{versionKey:false,timestamps:true})

export const Message = model<IMessage>("Message",messageSchema)