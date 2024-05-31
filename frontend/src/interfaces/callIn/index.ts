import { IChatMember } from "../chat"
import { IMessage, IUnreadMessage } from "../messages"

export interface ICallInRequestEventPayloadData {
    chat:{
        chatId:string
        avatar:string
        chatName:string
    }
    callee:string
}

export interface ICallInRequestEventReceiveData {
    chat:{
        chatId:string
        avatar:string
        chatName:string
    }
    caller:Omit<IChatMember , 'isActive'>
}

export interface ICallee extends Omit<IChatMember, 'isActive'> { 
    chatId:string
}

export interface IJoinedChat {
    chatId:string
    name:string,
    avatar:string,
    messages:Array<IMessage>,
    unreadMessages:IUnreadMessage
}

export interface ICallInAcceptEventReceiveData {
    chat:IJoinedChat
    callerId:string,
    callee:ICallee
}

export interface ICallAcceptEventPayloadData {
    callerId:string
    chat:{
        chatId:string
        name:string
        avatar:string
    }
}

export interface ICallOutEventReceiveData {
    caller:Omit<IChatMember, 'isActive'>
    callee:Omit<IChatMember, 'isActive'>
    chat:{
        chatId:string,
        name:string,
    }
}

export interface ICallOutEventPayloadData {
    callee:Omit<IChatMember , 'isActive'>
    chat:{
        chatId:string
        name:string
    }
}


export interface ICallInRejectEventReceiveData {
    callee:Omit<IChatMember , 'isActive'>
}