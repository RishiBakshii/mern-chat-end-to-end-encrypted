import { Types } from "mongoose"
import type { RequestStatus } from "../enums/request.enum.js"

export interface IRequest {
    sender:Types.ObjectId
    receiver:Types.ObjectId
    status?:RequestStatus
}