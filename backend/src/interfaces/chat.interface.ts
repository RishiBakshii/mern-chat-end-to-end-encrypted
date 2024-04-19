import { Types } from "mongoose"

export interface IChat {
    name?:string
    isGroupChat?:boolean
    members:Array<Types.ObjectId>
    avatar?:string
}