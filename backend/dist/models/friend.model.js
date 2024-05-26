import { Schema, model } from "mongoose";
const friendSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    friend: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    }
}, { versionKey: false, timestamps: true });
export const Friend = model('Friend', friendSchema);
//# sourceMappingURL=friend.model.js.map