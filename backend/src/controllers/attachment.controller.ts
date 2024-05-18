import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { uploadFilesToCloudinary } from "../utils/auth.util.js";
import { ACCEPTED_FILE_MIME_TYPES } from "../constants/file.constant.js";
import { Message } from "../models/message.model.js";
import { uploadAttachmentSchemaType } from "../schemas/message.schema.js";
import { emitEvent } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { IMessageEventPayload } from "../interfaces/message/message.interface.js";
import { IMemberDetails } from "../interfaces/chat/chat.interface.js";

const uploadAttachment = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(!req.files?.length){
        return next(new CustomError("Please provide the files",400))
    }

    const {chatId,memberIds}:uploadAttachmentSchemaType = req.body

    if(!chatId){
        return next(new CustomError("chatId is required",400))
    }

    if(!memberIds.length){
        return next(new CustomError("memberIds are required",400))
    }

    const attachments = req.files as Express.Multer.File[]

    const invalidFiles = attachments.filter((file:Express.Multer.File)=>!ACCEPTED_FILE_MIME_TYPES.includes(file.mimetype))
    
    if(invalidFiles.length) {
        const invalidFileNames = invalidFiles.map(file => file.originalname).join(', ');
        return next(new CustomError(`Unsupported file types: ${invalidFileNames}`, 400));
    }

    const uploadResults =  await uploadFilesToCloudinary(attachments)

    const attachmentsArray = uploadResults.map((result)=>{
        return {
            secureUrl:result.secure_url,
            publicId:result.public_id
        }
    })

    const message = await new Message({
        chat:chatId,
        sender:req.user?._id,
        attachments:attachmentsArray
    }).populate<{"sender":IMemberDetails}>("sender",['avatar',"username"])

    await message.save()

    const realtimeMessageResponse:IMessageEventPayload = {
        _id:message._id.toString(),
        chat:chatId,
        createdAt:message.createdAt,
        sender:{
            _id:message.sender._id,
            username:message.sender.username,
            avatar:message.sender.avatar.secureUrl
        },
        attachments:attachmentsArray.map(({secureUrl})=>secureUrl),
        updatedAt:message.updatedAt
    }

    emitEvent(req,Events.MESSAGE,memberIds,realtimeMessageResponse)

    return res.sendStatus(201).json()

})

export {uploadAttachment}