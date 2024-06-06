import { Types } from "mongoose"
import type { IAvatar } from "../auth/auth.interface.js"

export interface IChat {
    _id:Types.ObjectId
    name?:string
    isGroupChat?:boolean
    members:Array<Types.ObjectId>
    avatar?:IAvatar
    admin?:Types.ObjectId,
    latestMessage:Types.ObjectId
}

export interface IMemberDetails {
    _id:string
    username:string
    avatar:IAvatar
    isActive?:boolean
}

export interface IChatWithUnreadMessages extends Omit<IChat, 'members' | 'avatar'>{
    avatar?:IAvatar['secureUrl']
    members:Array<Omit<IMemberDetails, 'avatar'> & {avatar:string}>
    unreadMessages:{

        count?:number
        message?:{
            _id?:string,
            content?:string
        },
        sender?:{
            _id?:string,
            username?:string,
            avatar?:string
        }
    }
}