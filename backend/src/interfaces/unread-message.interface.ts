import { Types } from "mongoose";

export interface IUnreadMessage {
    user:Types.ObjectId
    chat:Types.ObjectId
    sender:Types.ObjectId
    readAt?:Date
    count:number
}