import { NextFunction, Response, request } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { Request } from "../models/request.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import type { createRequestSchemaType, handleRequestSchemaType } from "../schemas/request.schema.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/socket.util.js";
import { Events } from "../enums/event.enum.js";
import { IMemberDetails } from "../interfaces/chat.interface.js";

const getUserRequests = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const requests = await Request.find({receiver:req.user?._id})
    .populate<{sender:IMemberDetails}>("sender",['username','avatar.secureUrl']).select('-receiver').select("-updatedAt")
    
    const transformedRequests = requests.map(request=>{
        
        return {
            _id:request._id.toString(),
            sender:{
                _id:request.sender._id,
                username:request.sender.username,
                avatar:request.sender.avatar.secureUrl
            },
            status:request.status,
            createdAt:Date.now()
        }
    })

    return res.status(200).json(transformedRequests)
})

const createRequest = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {receiver}:createRequestSchemaType = req.body

    const isValidReceiverId = await User.findById(receiver)

    if(!isValidReceiverId){
        return next(new CustomError("Receiver not found",404))
    }

    if(req.user?._id.toString() === receiver){
        return next(new CustomError("You cannot send a request to yourself",400))
    }

    const isAlreadyCreated = await Request.findOne({receiver,sender:req.user?._id})

    if(isAlreadyCreated){
        return next(new CustomError("Request is already sent",400))
    }

    const newRequest = await new Request({receiver,sender:req.user?._id}).populate<{sender:IMemberDetails}>('sender',['username','avatar'])
    await newRequest.save()

    const transformedRequest = {

        _id:newRequest._id.toString(),
        sender:{
            _id:newRequest.sender._id,
            username:newRequest.sender.username,
            avatar:newRequest.sender.avatar.secureUrl
        },
        status:newRequest.status,
        createdAt:Date.now()
    }

    emitEvent(req,Events.NEW_FRIEND_REQUEST,[receiver],transformedRequest)

    return res.status(201).json(transformedRequest)

})

const handleRequest = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {action}:handleRequestSchemaType = req.body

    const isExistingRequest = await Request.findById(id)

    if(!isExistingRequest){
        return next(new CustomError("Request not found",404))
    }

    if(isExistingRequest.receiver._id.toString() !== req.user?._id.toString()){
        return next(new CustomError("Only the receiver of this request can accept or reject it",401))
    }

    if(action==='accept'){
        const newChat = await Chat.create({members:[isExistingRequest.sender,isExistingRequest.receiver]})
        await newChat.populate("members",['username','avatar'])
        await isExistingRequest.deleteOne()
        
        const membersStringIds = [isExistingRequest.sender.toString(),isExistingRequest.receiver.toString()]
        emitEvent(req,Events.NEW_GROUP,membersStringIds,{
            _id:newChat._id.toString(),
            isGroupChat:newChat.isGroupChat,
            members:newChat.members,
            unreadMessages:{
                count:0,
                message:{
                    _id:"",
                    content:""
                },
                sender:{
                    _id:"",
                    username:"",
                    avatar:""
                }
            }
        })
        return res.status(200).json(isExistingRequest._id)
    }
    else if(action==='reject'){
        await isExistingRequest.deleteOne()
        return res.status(200).json(isExistingRequest._id)
    }
    
})

export {getUserRequests,createRequest,handleRequest}