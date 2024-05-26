var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { asyncErrorHandler } from "../utils/error.utils.js";
import { Friend } from "../models/friend.model.js";
const getFriends = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const friends = yield Friend.aggregate([
        {
            $match: {
                user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
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
}));
export { getFriends };
//# sourceMappingURL=friend.controller.js.map