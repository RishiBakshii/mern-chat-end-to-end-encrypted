var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";
import { deleteFilesFromCloudinary, getSecureUserInfo, uploadFilesToCloudinary } from "../utils/auth.util.js";
const getUserDetails = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(req.user);
}));
const getUserByUsername = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.query;
    if (!username || !(username === null || username === void 0 ? void 0 : username.toString().trim())) {
        return next(new CustomError("Username cannot be empty"));
    }
    const regexUsername = new RegExp(username.toString().trim(), "i");
    const transformedResults = yield User.aggregate([
        {
            $match: {
                username: {
                    $regex: regexUsername
                }
            }
        },
        {
            $addFields: {
                avatar: "$avatar.secureUrl"
            }
        },
        {
            $project: {
                name: 1,
                username: 1,
                avatar: 1
            }
        }
    ]);
    return res.status(200).json(transformedResults);
}));
const udpateUser = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (req.file) {
        let uploadResults;
        const existingPublicId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.avatar) === null || _b === void 0 ? void 0 : _b.publicId;
        if (!existingPublicId) {
            uploadResults = yield uploadFilesToCloudinary([req.file]);
        }
        else if (existingPublicId) {
            const avatarPromise = [
                deleteFilesFromCloudinary([existingPublicId]),
                uploadFilesToCloudinary([req.file])
            ];
            const [_, result] = yield Promise.all(avatarPromise);
            uploadResults = result;
        }
        if (uploadResults) {
            const updatedUser = yield User.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c._id, {
                avatar: {
                    secureUrl: uploadResults[0].secure_url,
                    publicId: uploadResults[0].public_id
                }
            }, { new: true });
            return res.status(200).json(getSecureUserInfo(updatedUser));
        }
        return next(new CustomError("Some error occured", 500));
    }
}));
export { getUserDetails, getUserByUsername, udpateUser };
//# sourceMappingURL=user.controller.js.map