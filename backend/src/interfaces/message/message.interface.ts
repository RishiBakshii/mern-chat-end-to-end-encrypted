import { Types } from "mongoose"

export interface IMessage {
    _id:Types.ObjectId
    content:string
    sender:Types.ObjectId
    chat:Types.ObjectId
    attachments?:Array<String>
    createdAt:Date
    updatedAt:Date
}