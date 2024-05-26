import { Schema, model } from "mongoose";
const chatSchema = new Schema({
    name: {
        type: String,
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    members: {
        type: [
            {
                type: Schema.ObjectId,
                ref: "User"
            }
        ],
        required: true
    },
    avatar: {
        secureUrl: {
            type: String
        },
        publicId: {
            type: String
        }
    },
    admin: {
        type: Schema.ObjectId,
        ref: "User"
    }
}, { versionKey: false, timestamps: true });
export const Chat = model("Chat", chatSchema);
