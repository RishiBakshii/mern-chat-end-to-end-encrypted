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
import { User } from "../models/user.model.js";
import { env } from "../schemas/env.schema.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
export const verifyToken = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        return next(new CustomError("Token missing, please login again", 401));
    }
    const decodedInfo = jwt.verify(token, env.JWT_SECRET);
    if (!decodedInfo || !decodedInfo._id) {
        return next(new CustomError("Invalid token please login again", 401));
    }
    const existingUser = yield User.findOne({ _id: decodedInfo._id });
    if (!existingUser) {
        return next(new CustomError('Invalid Token, please login again', 401));
    }
    req.user = existingUser;
    next();
}));
//# sourceMappingURL=verify-token.middleware.js.map