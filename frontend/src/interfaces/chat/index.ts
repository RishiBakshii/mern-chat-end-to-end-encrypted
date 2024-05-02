import type { IUnreadMessage } from "../messages"

export interface IChatIntitalState {
    selectedChatId:string | null
}

export interface IChatMember {
    _id:string
    username:string
    avatar:string
}

export interface IChatWithUnreadMessages {
    _id:string
    name?:string
    isGroupChat:boolean
    members:Array<IChatMember>
    avatar?:string
    admin:string,
    unreadMessages:IUnreadMessage
    seenBy?:Array<IChatMember>
}