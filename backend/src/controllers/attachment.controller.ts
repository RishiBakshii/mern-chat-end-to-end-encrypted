import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { uploadFilesToCloudinary } from "../utils/auth.util.js";
import { ACCEPTED_FILE_MIME_TYPES } from "../constants/file.constant.js";
import { Message } from "../models/message.model.js";
import { uploadAttachmentSchemaType } from "../schemas/message.schema.js";
import { emitEvent, emitEventToRoom, getOtherMembers } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { IMessageEventPayload } from "../interfaces/message/message.interface.js";
import { IMemberDetails } from "../interfaces/chat/chat.interface.js";
import { UnreadMessage } from "../models/unread-message.model.js";
import { IUnreadMessageEventPayload } from "../interfaces/unread-message/unread-message.interface.js";
import { Types } from "mongoose";
import { Chat } from "../models/chat.model.js";

interface IAttachment {
    _id:string
    attachments:Array<string>
}

const uploadAttachment = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(!req.files?.length){
        return next(new CustomError("Please provide the files",400))
    }

    const {chatId}:uploadAttachmentSchemaType = req.body

    console.log(chatId);
    const isExistingChat = await Chat.findById(chatId)

    if(!isExistingChat){
        return next(new CustomError("Chat not found",404))
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

    emitEventToRoom(req,Events.MESSAGE,chatId,realtimeMessageResponse)

    const otherMembers = getOtherMembers({members:isExistingChat.members.map(member=>member._id.toString()),user:req.user?._id.toString()!})

    const updateOrCreateUnreadMessagePromise = otherMembers.map(async(memberId)=>{

        const isExistingUnreadMessage = await UnreadMessage.findOne({chat:chatId,user:memberId})

        if(isExistingUnreadMessage){
            isExistingUnreadMessage.count? isExistingUnreadMessage.count++ : null
            isExistingUnreadMessage.message = message._id
            isExistingUnreadMessage.save()
            return isExistingUnreadMessage
        }

       return UnreadMessage.create({chat:chatId,user:memberId,sender:req.user?._id,message:message._id})

    })

    await Promise.all(updateOrCreateUnreadMessagePromise)

    const unreadMessageData:IUnreadMessageEventPayload = 
    {
        chatId:chatId,
        message:{
            attachments:message.attachments?true:false
        },
        sender:{
            _id:message.sender._id,
            avatar:message.sender.avatar.secureUrl,
            username:message.sender.username
        }
    }

    emitEventToRoom(req,Events.UNREAD_MESSAGE,chatId,unreadMessageData)

    return res.status(201).json({})

})

const fetchAttachments = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const { page = 1, limit = 6 } = req.query;

    const pipelineResults = await Message.aggregate([
        {
           $match:{
            chat:new Types.ObjectId(id),
            attachments:{$ne:[]}
           } 
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $unwind: "$attachments",
        },
        {
            $group:{
                _id:"$chat",
                attachments:{$push:"$attachments.secureUrl"}
            }
        },
    ])

    if(!pipelineResults.length){
        return res.status(200).json({_id:id,attachments:[],totalPages:0})
    }

    const result = pipelineResults[0] as IAttachment
    const totalPages =  Math.ceil(result.attachments.length/Number(limit))
    const totalAttachments = result.attachments.length
    result.attachments = result.attachments?.slice((Number(page) - 1) * Number(limit),Number(page) * Number(limit));
    
    res.status(200).json({...result,totalPages,totalAttachments});
    
})

export {uploadAttachment,fetchAttachments}