import { Types } from "mongoose";

export interface IFriend {
    _id:Types.ObjectId
    user:Types.ObjectId
    friend:Types.ObjectId,
    createdAt:Date
    updatedAt:Date
}