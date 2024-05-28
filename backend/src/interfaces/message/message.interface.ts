import { Types } from "mongoose"
import { IMemberDetails } from "../chat/chat.interface.js"

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
    isPoll?:boolean
    pollQuestion?:string
    pollOptions?:Array<{option:string,votes:Array<Types.ObjectId>}>
    isMultipleAnswers?:boolean
    isEdited?:boolean
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
    isPoll?:boolean
    pollQuestion?:string
    pollOptions?:Array<{option:string,votes:Array<IMemberDetails>}>
    createdAt: Date,
    updatedAt:  Date
}