import { Schema, model } from "mongoose";
import { env } from "../schemas/env.schema.js";
const otpSchema = new Schema({
    hashedOtp: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + (parseInt(env.OTP_EXPIRATION_MINUTES) * 60 * 1000))
    }
}, { versionKey: false });
export const Otp = model("Otp", otpSchema);
//# sourceMappingURL=otp.model.js.map