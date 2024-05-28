import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";
import { Types } from "mongoose";
import { calculateSkip } from "../utils/generic.js";

const getMessages = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const {page = 1, limit = 20} = req.query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    const messages = await Message.aggregate(
        [
            // matching
            {
              $match: {
                chat: new Types.ObjectId(id)
              }
            },
            // sender population
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                  {
                    $project: {
                      avatar: "$avatar.secureUrl",
                      username: 1
                    }
                  }
                ]
              }
            },
            // getting sender[0] in sender feild
            {
              $addFields: {
                sender: {
                  $arrayElemAt: ["$sender", 0]
                }
              }
            },
            {
              $addFields: {
                attachments: "$attachments.secureUrl"
              }
            },
            {
              $unwind: {
                path: "$pollOptions",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "pollOptions.votes",
                foreignField: "_id",
                as: "pollOptions.votes",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      avatar: "$avatar.secureUrl"
                    }
                  }
                ]
              }
            },
            {
              $group: {
                _id: "$_id",
                sender: { $first: "$sender" },
                chat: { $first: "$chat" },
                isPoll: { $first: "$isPoll" },
                pollQuestion: { $first: "$pollQuestion" },
                pollOptions: { $push: "$pollOptions" },
                isMultipleAnswers: { $first: "$isMultipleAnswers" },
                url: { $first: "$url" },
                attachments: { $first: "$attachments" },
                content: { $first: "$content" },
                isEdited: { $first: "$isEdited" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" }
              }
            },
            {
                $skip:calculateSkip(pageNumber,limitNumber)
            },
            {
                $limit:limitNumber
            },
            {
                $sort: {
                  createdAt: -1
                }
            },
        ]
    )

    const totalMessagesCount = await Message.countDocuments({ chat: new Types.ObjectId(id) });
    const totalPages = Math.ceil(totalMessagesCount / limitNumber);

    const messagesWithTotalPage = {
        messages:messages.reverse(),
        totalPages,
    }
    return res.status(200).json(messagesWithTotalPage)

})

export {getMessages}