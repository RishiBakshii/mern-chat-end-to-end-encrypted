import { Types } from "mongoose"

export interface IOtp {
    hashedOtp:string
    user:Types.ObjectId
    expiresAt?:Date
}