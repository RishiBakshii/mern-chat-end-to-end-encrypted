import { Schema, Types, model } from "mongoose";
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
    },
    isPoll:{
        type:Boolean
    },
    pollQuestion:{
        type:String
    },
    pollOptions:{
        type:[
            {
                option:String,
                votes:[{
                    type:Types.ObjectId,
                    ref:"User"
                }]
            }
        ]
    },
    isEdited:{
        type:Boolean
    }
},{versionKey:false,timestamps:true})

export const Message = model<IMessage>("Message",messageSchema)