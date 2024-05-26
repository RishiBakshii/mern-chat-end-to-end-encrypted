import { Schema, model } from "mongoose";
const unreadMessageSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: Schema.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: Schema.ObjectId,
        ref: "Message",
        required: true
    },
    count: {
        type: Number,
        default: 1
    },
    readAt: {
        type: Date,
    },
}, { versionKey: false, timestamps: true });
export const UnreadMessage = model("UnreadMessage", unreadMessageSchema);
//# sourceMappingURL=unread-message.model.js.map