import { Types } from "mongoose"

export interface IUser {
    _id:Types.ObjectId
    name:string
    username:string
    avatar?:string
    email:string
    password:string
    verified?:boolean
}