import { Schema, model } from "mongoose";
import { env } from "../schemas/env.schema.js";
const resetPasswordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hashedToken: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + (parseInt(env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES) * 60 * 1000))
    }
}, { versionKey: false });
export const ResetPassword = model("Reset-Password", resetPasswordSchema);
//# sourceMappingURL=reset-password.model.js.map