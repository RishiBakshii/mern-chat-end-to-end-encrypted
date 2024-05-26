var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/user.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { generateOtp, getSecureUserInfo, sendToken } from "../utils/auth.util.js";
import bcrypt from 'bcryptjs';
import { sendMail } from "../utils/email.util.js";
import { ResetPassword } from "../models/reset-password.model.js";
import { env } from "../schemas/env.schema.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/env.config.js";
import { Otp } from "../models/otp.model.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
const signup = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, name } = req.body;
    const isExistingUser = yield User.findOne({ email });
    if (isExistingUser) {
        return next(new CustomError("User already exists", 400));
    }
    const existingUsername = yield User.findOne({ username });
    if (existingUsername) {
        return next(new CustomError("Username is already taken", 400));
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    const newUser = yield User.create({ email, name, password: hashedPassword, username, avatar: {
            secureUrl: DEFAULT_AVATAR
        } });
    sendToken(res, newUser._id, 201, getSecureUserInfo(newUser));
}));
const login = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isExistingUser = yield User.findOne({ email }).select("+password");
    if (isExistingUser && (yield bcrypt.compare(password, isExistingUser.password))) {
        sendToken(res, isExistingUser['_id'], 200, getSecureUserInfo(isExistingUser));
        return;
    }
    return next(new CustomError("Invalid Credentials", 404));
}));
const forgotPassword = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const isValidUser = yield User.findOne({ email });
    if (!isValidUser) {
        return next(new CustomError("User with this email does not exists", 404));
    }
    yield ResetPassword.deleteMany({ user: isValidUser._id });
    const token = jwt.sign({ _id: isValidUser._id.toString() }, env.JWT_SECRET);
    const hashedToken = yield bcrypt.hash(token, 10);
    yield ResetPassword.create({ user: isValidUser._id, hashedToken });
    const resetUrl = `${config.clientUrl}/auth/reset-password?token=${token}&user=${isValidUser._id.toString()}`;
    yield sendMail(email, isValidUser.username, "resetPassword", resetUrl, undefined);
    res.status(200).json({ message: `We have sent a password reset link on ${email}` });
}));
const resetPassword = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword, userId } = req.body;
    const doesPasswordResetExists = yield ResetPassword.findOne({ user: userId });
    if (!doesPasswordResetExists) {
        return next(new CustomError("Password reset link is invalid", 404));
    }
    const isValidUser = yield User.findById(userId);
    if (!isValidUser) {
        return next(new CustomError("User not found", 404));
    }
    if (doesPasswordResetExists.expiresAt < new Date) {
        yield doesPasswordResetExists.deleteOne();
        return next(new CustomError("Password reset link has been expired", 400));
    }
    const decodedInfo = jwt.verify(token, env.JWT_SECRET);
    if (!decodedInfo || !decodedInfo._id || decodedInfo._id.toString() !== userId) {
        console.log(decodedInfo._id);
        return next(new CustomError("Password reset link is invalid", 400));
    }
    isValidUser.password = yield bcrypt.hash(newPassword, 10);
    yield isValidUser.save();
    yield ResetPassword.deleteMany({ user: decodedInfo._id });
    return res.status(200).json({ message: `Dear ${isValidUser.username}, your password has been reset successfuly` });
}));
const sendOtp = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    yield Otp.deleteMany({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    const otp = generateOtp();
    const hashedOtp = yield bcrypt.hash(otp, 10);
    const newOtp = yield Otp.create({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, hashedOtp });
    yield sendMail((_c = req.user) === null || _c === void 0 ? void 0 : _c.email, (_d = req.user) === null || _d === void 0 ? void 0 : _d.username, "OTP", undefined, otp);
    return res.status(201).json({ message: `We have sent the otp on ${(_e = req.user) === null || _e === void 0 ? void 0 : _e.email}` });
}));
const verifyOtp = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    const { otp } = req.body;
    const isOtpExisting = yield Otp.findOne({ user: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id });
    if (!isOtpExisting) {
        return next(new CustomError("Otp does not exists", 404));
    }
    if (isOtpExisting.expiresAt < new Date) {
        yield isOtpExisting.deleteOne();
        return next(new CustomError("Otp has been expired", 400));
    }
    if (!(yield bcrypt.compare(otp, isOtpExisting.hashedOtp))) {
        return next(new CustomError("Otp is invalid", 400));
    }
    yield isOtpExisting.deleteOne();
    const verifiedUser = yield User.findByIdAndUpdate((_g = req.user) === null || _g === void 0 ? void 0 : _g._id, { verified: true }, { new: true });
    return res.status(200).json(getSecureUserInfo(verifiedUser));
}));
const checkAuth = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        return res.status(200).json(getSecureUserInfo(req.user));
    }
    return next(new CustomError("Token missing, please login again", 401));
}));
const redirectHandler = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    if (req.user) {
        sendToken(res, (_h = req.user) === null || _h === void 0 ? void 0 : _h._id, 200, getSecureUserInfo(req.user), true);
    }
    else {
        return res.redirect("/");
    }
}));
const logout = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token").status(200).json({ message: "Logout successful" });
}));
export { signup, login, logout, forgotPassword, resetPassword, sendOtp, verifyOtp, checkAuth, redirectHandler };
//# sourceMappingURL=auth.controller.js.map