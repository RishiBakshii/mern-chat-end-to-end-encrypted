var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { env } from '../schemas/env.schema.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.config.js';
export const sendToken = (res, payload, statusCode, data, OAuth = false) => {
    const cookieOptions = {
        maxAge: parseInt(env.JWT_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: env.NODE_ENV === 'DEVELOPMENT' ? "lax" : "none"
    };
    const token = jwt.sign({ _id: payload.toString() }, env.JWT_SECRET, { expiresIn: `${env.JWT_TOKEN_EXPIRATION_DAYS}d` });
    if (OAuth) {
        return res.cookie('token', token, cookieOptions).redirect(config.clientUrl);
    }
    return res.cookie("token", token, cookieOptions).status(statusCode).json(data);
};
export const generateOtp = () => {
    let OTP = "";
    for (let i = 0; i < 4; i++) {
        OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
};
export const uploadFilesToCloudinary = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = files.map(file => cloudinary.uploader.upload(file.path));
    const result = yield Promise.all(uploadPromises);
    return result;
});
export const deleteFilesFromCloudinary = (publicIds) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
    const uploadResult = yield Promise.all(deletePromises);
    return uploadResult;
});
export const getSecureUserInfo = (user) => {
    var _a;
    return {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: (_a = user.avatar) === null || _a === void 0 ? void 0 : _a.secureUrl,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        verified: user.verified
    };
};
//# sourceMappingURL=auth.util.js.map