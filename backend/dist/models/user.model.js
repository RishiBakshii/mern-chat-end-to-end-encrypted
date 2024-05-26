import { Schema, model } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    avatar: {
        secureUrl: {
            type: String
        },
        publicId: {
            type: String
        }
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { versionKey: false, timestamps: true });
export const User = model("User", userSchema);
//# sourceMappingURL=user.model.js.map