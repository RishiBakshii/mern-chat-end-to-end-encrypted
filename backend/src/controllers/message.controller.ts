import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";
import { Types } from "mongoose";

const getMessages = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.params

    const messages = await Message.aggregate([

        {
            $match: {
                chat: new Types.ObjectId(id),
            },
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
    ])

    return res.status(200).json(messages)

})

export {getMessages}