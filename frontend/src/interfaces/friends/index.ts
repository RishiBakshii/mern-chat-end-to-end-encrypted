import { IChatMember } from "../chat"

export interface IFriend extends IChatMember {
    isActive:boolean
    createdAt:Date
}