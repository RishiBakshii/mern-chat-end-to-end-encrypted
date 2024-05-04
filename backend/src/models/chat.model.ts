import { Schema, model } from "mongoose";
import type { IChat } from "../interfaces/chat.interface.js";


const chatSchema = new Schema<IChat>({
    name:{
        type:String,
    },
    isGroupChat:{
        type:Boolean,
        default:false
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
        secureUrl:{
            type:String
        },
        publicId:{
            type:String
        }
    },
    admin:{
        type:Schema.ObjectId,
        ref:"User"
    }
},{versionKey:false,timestamps:true})

export const Chat = model<IChat>("Chat",chatSchema)