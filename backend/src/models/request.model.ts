import { Schema, model } from "mongoose";
import type { IRequest } from "../interfaces/request.interface.js";
import { RequestStatus } from "../enums/request.enum.js";


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
        enum:[RequestStatus.Accepted,RequestStatus.Pending,RequestStatus.Rejected],
        default:RequestStatus.Pending
    },
},{versionKey:false,timestamps:true})

export const Request = model<IRequest>("Request",requestSchema)