import { Schema, model } from "mongoose";
import type { IRequest } from "../interfaces/request/request.interface.js";
import { RequestStatus } from "../enums/request/request.enum.js";


const requestSchema = new Schema<IRequest>({
    sender:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:RequestStatus,
        default:RequestStatus.Pending
    },
},{versionKey:false,timestamps:true})

export const Request = model<IRequest>("Request",requestSchema)