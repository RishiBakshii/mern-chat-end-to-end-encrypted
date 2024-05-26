import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { env } from "../schemas/env.schema.js";
import { CustomError } from "../utils/error.utils.js";
export const socketAuthenticatorMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie?.split(";")[0].split("=")[1];
        if (!token) {
            return next(new CustomError("Token missing, please login again", 401));
        }
        const decodedInfo = jwt.verify(token, env.JWT_SECRET);
        if (!decodedInfo || !decodedInfo._id) {
            return next(new CustomError("Invalid token please login again", 401));
        }
        const existingUser = await User.findOne({ _id: decodedInfo._id });
        if (!existingUser) {
            return next(new CustomError('Invalid Token, please login again', 401));
        }
        socket.user = existingUser;
        next();
    }
    catch (error) {
        console.log(error);
        return next(new CustomError("Invalid Token, please login again", 401));
    }
};
