import { Types } from "mongoose";

export interface IUnreadMessage {
    user:Types.ObjectId
    chat:Types.ObjectId
    sender:Types.ObjectId
    message:Types.ObjectId
    readAt?:Date
    count?:number
}


export interface IUnreadMessageEventPayload {
    chatId:string,
    message?:{
        content?:string
        url?:boolean
        attachments?:boolean
        poll?:boolean
    },
    sender:{
        _id:string,
        avatar:string,
        username:string
    }
}