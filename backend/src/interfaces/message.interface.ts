import { Types } from "mongoose"

export interface IMessage {
    _id:string
    content:string
    sender:Types.ObjectId
    chat:Types.ObjectId
    attachments?:Array<String>
}