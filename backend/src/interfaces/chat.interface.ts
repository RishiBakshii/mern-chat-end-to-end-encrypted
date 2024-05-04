import { Types } from "mongoose"

export interface IChat {
    _id:Types.ObjectId
    name?:string
    isGroupChat?:boolean
    members:Array<Types.ObjectId>
    avatar?:string
    admin?:Types.ObjectId,
}

export interface IMemberDetails {
    _id:string
    username:string
    avatar:string
}

export interface IChatWithUnreadMessages extends Omit<IChat, 'members'>{

    members:Array<IMemberDetails>
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