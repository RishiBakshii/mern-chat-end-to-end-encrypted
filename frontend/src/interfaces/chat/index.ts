import type { IUnreadMessage } from "../messages"

export interface IChatIntitalState {
    selectedChatId:string | null
    selectedChatDetails:IChatWithUnreadMessages| null
}

export interface IChatMember {
    _id:string
    username:string
    avatar:string
    isActive:boolean
}

export interface IChatWithUnreadMessages {
    _id:string
    name?:string
    isGroupChat:boolean
    members:Array<IChatMember>
    avatar?:string
    admin:string
    unreadMessages:IUnreadMessage
    seenBy:Array<IChatMember>
    userTyping:Array<IChatMember>
}

export interface IUserTypingEventReceiveData {
    chatId:string
    user:IChatMember
}

export interface INewMemberAddedEventPayloadData {
    chatId:string,
    members:Array<IChatMember>
}

export interface IDeleteChatEventReceiveData {
    chatId:string
}
export interface IMemberRemovedEventReceiveData extends IDeleteChatEventReceiveData {
    membersId:Array<string>
}