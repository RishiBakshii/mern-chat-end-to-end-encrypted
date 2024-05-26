import { asyncErrorHandler } from "../utils/error.utils.js";
import { Friend } from "../models/friend.model.js";
const getFriends = asyncErrorHandler(async (req, res, next) => {
    const friends = await Friend.aggregate([
        {
            $match: {
                user: req.user?._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "friend",
                foreignField: "_id",
                as: "friend",
                pipeline: [
                    {
                        $addFields: {
                            avatar: "$avatar.secureUrl"
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$friend"
        },
        {
            $addFields: {
                "friend.createdAt": "$createdAt"
            }
        },
        {
            $replaceRoot: { newRoot: "$friend" }
        },
    ]);
    return res.status(200).json(friends);
});
export { getFriends };
