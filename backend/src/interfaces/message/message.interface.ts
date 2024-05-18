import { Types } from "mongoose"

export interface IAttachment {
    secureUrl:string,
    publicId:string
}

export interface IMessage {
    _id:Types.ObjectId
    content?:string
    sender:Types.ObjectId
    chat:Types.ObjectId
    url?:string
    attachments?:Array<IAttachment>
    createdAt:Date
    updatedAt:Date
}

export interface IMessageEventPayload {

    _id: string,
    content?: string,
    sender: {
        _id: string,
        avatar: string,
        username: string
    },
    chat: string,
    url?:string,
    attachments?:Array<IAttachment['secureUrl']>,
    createdAt: Date,
    updatedAt:  Date
}