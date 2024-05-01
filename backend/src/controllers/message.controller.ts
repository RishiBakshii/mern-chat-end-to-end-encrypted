import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";

const getMessages = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const messages = await Message.find({chat:id}).populate("sender",['username','avatar'])
    return res.status(200).json(messages)

})

export {getMessages}