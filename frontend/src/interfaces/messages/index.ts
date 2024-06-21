import { IChatMember } from "../chat"

export interface IPollOption {
    option:string,
    votes:Array<IChatMember>
}

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
    isPoll?:boolean
    pollQuestion?:string
    pollOptions?:Array<IPollOption>
    reactions:Array<{user:Pick<IChatMember, '_id' | 'username' | 'avatar'>,emoji:string}>,
    isMultipleAnswers?:boolean
    createdAt:Date
    updatedAt:Date
    isNew?:boolean
}

export interface IUnreadMessage {
    count:number
    message:{
        content?:string
        url?:boolean
        attachments?:boolean
        poll?:boolean,
        createdAt:Date
    },
    sender:IChatMember
}

export interface IMessageEventPayloadData {
    chat:string
    content?:string | ArrayBuffer
    url?:string
    isPoll?:boolean
    pollQuestion?:string
    pollOptions?:Array<{option:string,votes:Array<string>}>
    isMultipleAnswers?:boolean
}

export interface IMessageSeenEventPayloadData {
    chatId:string
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
    chatId:string
}

export interface IEditMessageEventReceiveData {
    _id: string
    chat: string
    content: string
    isEdited: boolean
}

export interface IVoteInEventPayloadData {
    chatId:string
    messageId:string
    optionIndex:number
}

export interface IVoteInEventReceiveData {
    _id:string
    user:IChatMember
    optionIndex:number
}

export interface IVoteOutEventReceiveData extends Omit<IVoteInEventReceiveData,'user'> {
    user:Pick<IChatMember , '_id'>
}

export interface INewReactionEventReceiveData {
    chatId:string
    messageId:string
    user:Pick<IChatMember, '_id' | 'username' | 'avatar'>
    emoji:string
}

export interface IDeleteReactionEventReceiveData {
    chatId:string
    messageId:string
    userId:string
}

export interface INewReactionEventPayloadData {
    chatId:string,
    messageId:string,
    reaction:string
}

export interface IUserTypingEventPayloadData extends IMessageSeenEventPayloadData {}
export interface IVoteOutEventPayloadData extends IVoteInEventPayloadData {}