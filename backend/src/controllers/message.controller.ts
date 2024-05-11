import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";
import { IMemberDetails } from "../interfaces/chat/chat.interface.js";

const getMessages = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const messages = await Message.find({chat:id}).populate<{sender:IMemberDetails}>("sender",['username','avatar'])

    const transformedMessages = messages.map(message=>{
        return {
            _id: message._id,
            content: message.content,
            sender: {
                _id: message.sender._id,
                avatar: message.sender.avatar.secureUrl,
                username: message.sender.username
            },
            chat: message.chat.toString(),
            attachments: message.attachments,
            createdAt: message.createdAt,
            updatedAt:  message.updatedAt
              
        }
    })

    return res.status(200).json(transformedMessages)

})

export {getMessages}