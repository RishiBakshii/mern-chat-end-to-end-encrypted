import { Types } from "mongoose"

export interface IUser {
    _id:Types.ObjectId
    name:string
    username:string
    avatar?:{
        secureUrl:string,
        publicId:string
    }
    email:string
    password:string
    verified?:boolean,
    createdAt?:Date
    updatedAt?:Date
}