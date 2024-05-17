import { RequestStatus } from "../../enums/request"
import { IChatMember } from "../chat"

export interface IFriendRequest {
    _id:string
    sender:IChatMember
    status:RequestStatus
    createdAt:Date
}