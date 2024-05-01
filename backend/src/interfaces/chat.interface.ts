import { Types } from "mongoose"
import type { IUnreadMessage } from "./unread-message.interface.js"

export interface IChat {
    _id:Types.ObjectId
    name?:string
    isGroupChat?:boolean
    members:Array<Types.ObjectId>
    avatar?:string
    admin?:Types.ObjectId,
}

export interface IChatWithUnreadMessages extends IChat {
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