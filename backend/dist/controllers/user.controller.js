import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";
import { deleteFilesFromCloudinary, getSecureUserInfo, uploadFilesToCloudinary } from "../utils/auth.util.js";
const getUserDetails = asyncErrorHandler(async (req, res, next) => {
    return res.status(200).json(req.user);
});
const getUserByUsername = asyncErrorHandler(async (req, res, next) => {
    const { username } = req.query;
    if (!username || !username?.toString().trim()) {
        return next(new CustomError("Username cannot be empty"));
    }
    const regexUsername = new RegExp(username.toString().trim(), "i");
    const transformedResults = await User.aggregate([
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
});
const udpateUser = asyncErrorHandler(async (req, res, next) => {
    if (req.file) {
        let uploadResults;
        const existingPublicId = req.user?.avatar?.publicId;
        if (!existingPublicId) {
            uploadResults = await uploadFilesToCloudinary([req.file]);
        }
        else if (existingPublicId) {
            const avatarPromise = [
                deleteFilesFromCloudinary([existingPublicId]),
                uploadFilesToCloudinary([req.file])
            ];
            const [_, result] = await Promise.all(avatarPromise);
            uploadResults = result;
        }
        if (uploadResults) {
            const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
                avatar: {
                    secureUrl: uploadResults[0].secure_url,
                    publicId: uploadResults[0].public_id
                }
            }, { new: true });
            return res.status(200).json(getSecureUserInfo(updatedUser));
        }
        return next(new CustomError("Some error occured", 500));
    }
});
export { getUserDetails, getUserByUsername, udpateUser };
