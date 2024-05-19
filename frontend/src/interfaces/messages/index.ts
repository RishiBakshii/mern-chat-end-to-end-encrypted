import { IChatMember } from "../chat"

export interface IMessage {
    _id:string
    content?:string
    sender:{
        _id:string
        username:string
        avatar:string
    }
    chat:string
    url?:string
    isEdited?:boolean
    attachments?:Array<string> | []
    createdAt:Date
    updatedAt:Date
}

export interface IUnreadMessage {
    count:number
    message:{
        _id:string,
        content:string
    },
    sender:IChatMember
}

export interface IMessageEventPayloadData {
    chat:string
    content?:string
    url?:string
    members:Array<string>
}

export interface IMessageSeenEventPayloadData {
    chatId:string
    members:Array<string>
}

export interface IMessageSeenEventReceiveData {
    chat:string,
    user:IChatMember
    readAt:Date
}

export interface IUnreadMessageEventReceiveData {
    chatId:string
    message:IUnreadMessage['message']
    sender:IChatMember
}

export interface IEditMessageEventPayloadData {
    messageId:string,
    updatedContent:string,
    memberIds:Array<string>
}

export interface IEditMessageEventReceiveData {
    _id: string
    chat: string
    content: string
    isEdited: boolean
}

export interface IUserTypingEventPayloadData extends IMessageSeenEventPayloadData {}