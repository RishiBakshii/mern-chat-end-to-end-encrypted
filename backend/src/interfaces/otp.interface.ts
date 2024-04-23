import { Types } from "mongoose"

export interface IOtp {
    otp:string
    user:Types.ObjectId
    expiresAt?:Date
}