import { Types } from "mongoose"

export interface IAvatar {
    secureUrl:string,
    publicId:string
}

export interface IUser {
    _id:Types.ObjectId
    name:string
    username:string
    avatar?:IAvatar
    email:string
    password:string
    verified?:boolean,
    createdAt?:Date
    updatedAt?:Date
}