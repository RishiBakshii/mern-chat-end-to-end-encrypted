import { Types } from "mongoose"

export interface IMessage {
    content:string
    sender:Types.ObjectId
    chat:Types.ObjectId
    attachments?:Array<String>
}