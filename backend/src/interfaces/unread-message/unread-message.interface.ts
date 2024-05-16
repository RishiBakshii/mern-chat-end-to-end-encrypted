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
        _id?:string,
        content?:string
    },
    sender:{
        _id:string,
        avatar:string,
        username:string
    }
}