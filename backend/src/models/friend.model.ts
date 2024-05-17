import { Schema, model } from "mongoose";
import type { IFriend } from "../interfaces/friend/friend.interface.js";

const friendSchema = new Schema<IFriend>({
    user:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    },
    friend:{
        type:Schema.ObjectId,
        ref:"User",
        required:true
    }
},{versionKey:false,timestamps:true})

export const Friend = model<IFriend>('Friend',friendSchema)