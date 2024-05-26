var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Message } from "../models/message.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";
import { Types } from "mongoose";
const getMessages = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const messages = yield Message.aggregate([
        {
            $match: {
                chat: new Types.ObjectId(id),
            },
        },
        {
            $sort: {
                'createdAt': -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $addFields: {
                            avatar: "$avatar.secureUrl",
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                sender: {
                    $arrayElemAt: ["$sender", 0],
                },
            },
        },
        {
            $addFields: {
                "attachments": "$attachments.secureUrl"
            },
        },
        // {
        //     $unwind:{
        //         path:"$pollOptions",
        //         preserveNullAndEmptyArrays:true,
        //     }
        // },
        // {
        //     $lookup:{
        //         from:"users",
        //         localField:"pollOptions.votes",
        //         foreignField:"_id",
        //         as:"pollOptions.votes",
        //         pipeline:[
        //             {
        //                 $project:{
        //                     username:1,
        //                     avatar:"$avatar.secureUrl"
        //                 }
        //             }
        //         ]
        //     }
        // },
        // {
        //     $group: {
        //       _id: "$_id",  // Group by the original message _id
        //       sender: { $first: "$sender" },  // Keep the first sender object
        //       chat: { $first: "$chat" },  // Keep the first chat ID
        //       isPoll: { $first: "$isPoll" },  // Keep the first isPoll flag
        //       content:{$first:'$content'},
        //       url:{$first:'$url'},
        //       pollQuestion: { $first: "$pollQuestion" }, // Keep the first pollQuestion
        //       pollOptions: {
        //         $push: "$pollOptions"  // Push each unwound pollOption into the array
        //       },
        //       attachments: { $first: "$attachments" },  // Keep the first attachments array (optional)
        //     //   createdAt: { $first: "$createdAt" },  // Keep the first createdAt timestamp
        //       updatedAt: { $first: "$updatedAt" },  // Keep the first updatedAt timestamp
        //     }
        // },
        {
            $skip: Math.ceil((pageNumber - 1) * limitNumber)
        },
        {
            $limit: limitNumber,
        },
    ]);
    const totalMessagesCount = yield Message.countDocuments({ chat: new Types.ObjectId(id) });
    const totalPages = Math.ceil(totalMessagesCount / limitNumber);
    const messagesWithTotalPage = {
        messages: messages.reverse(),
        totalPages,
    };
    return res.status(200).json(messagesWithTotalPage);
}));
export { getMessages };
//# sourceMappingURL=message.controller.js.map