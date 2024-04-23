import { Types } from "mongoose";

export interface IResetPassword {
    user:Types.ObjectId,
    hashedToken:string,
    expiresAt?:Date
}