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
export const uploadFilesToCloudinary = async (files) => {
    const uploadPromises = files.map(file => cloudinary.uploader.upload(file.path));
    const result = await Promise.all(uploadPromises);
    return result;
};
export const deleteFilesFromCloudinary = async (publicIds) => {
    const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
    const uploadResult = await Promise.all(deletePromises);
    return uploadResult;
};
export const getSecureUserInfo = (user) => {
    return {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar?.secureUrl,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        verified: user.verified
    };
};
