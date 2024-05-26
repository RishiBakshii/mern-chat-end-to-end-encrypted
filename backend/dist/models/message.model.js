import { Schema, Types, model } from "mongoose";
const messageSchema = new Schema({
    content: {
        type: String,
    },
    sender: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: Schema.ObjectId,
        ref: "Chat",
        required: true
    },
    attachments: {
        type: [
            {
                secureUrl: String,
                publicId: String
            }
        ],
    },
    url: {
        type: String
    },
    isPoll: {
        type: Boolean
    },
    pollQuestion: {
        type: String
    },
    pollOptions: {
        type: [
            {
                option: String,
                votes: [{
                        type: Types.ObjectId,
                        ref: "User"
                    }]
            }
        ]
    },
    isEdited: {
        type: Boolean
    }
}, { versionKey: false, timestamps: true });
export const Message = model("Message", messageSchema);
//# sourceMappingURL=message.model.js.map