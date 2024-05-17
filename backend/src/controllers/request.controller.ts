import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { Request } from "../models/request.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import type { createRequestSchemaType, handleRequestSchemaType } from "../schemas/request.schema.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { populateMembersStage } from "./chat.controller.js";
import { Friend } from "../models/friend.model.js";


const requestPipeline = [
  {
      $project:{
          receiver:0,
          updatedAt:0
      }
  },
  {
    $lookup: {
      from: "users",
      localField: "sender",
      foreignField: "_id",
      as: "sender",
      pipeline:[
        {
          $addFields:{
            avatar:"$avatar.secureUrl"
          }
        },
        {
          $project:{
            username:1,
            avatar:1
          }
        },
      ]
    }
  },
  {
    $addFields: {
      "sender": {
        $arrayElemAt:["$sender",0]
      }
    }
  }
]

const getUserRequests = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const requests = await Request.aggregate([
        {
          $match:{
            receiver: req.user?._id
          }
        }
        ,...requestPipeline
      ])

    return res.status(200).json(requests)
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

    const newRequest = await Request.create({receiver,sender:req.user?._id})

    const transformedRequest = await Request.aggregate([

      {
        $match:{
          _id:newRequest._id
        }
      },
      ...requestPipeline
    ])

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

        const members = [isExistingRequest.sender,isExistingRequest.receiver]
        const newChat = await Chat.create({members})

        const friends = await Friend.insertMany([
          {user:isExistingRequest.receiver,friend:isExistingRequest.sender},
          {user:isExistingRequest.sender,friend:isExistingRequest.receiver}
        ])

        const transformedChat =  await Chat.aggregate([
          {
            $match:{
              _id:newChat._id
            }
          },
          populateMembersStage,
        ])

        
        const membersStringIds = [isExistingRequest.sender.toString(),isExistingRequest.receiver.toString()]

        emitEvent(req,Events.NEW_GROUP,membersStringIds,transformedChat)

        await isExistingRequest.deleteOne()

        return res.status(200).json(isExistingRequest._id)
    }
    else if(action==='reject'){
        await isExistingRequest.deleteOne()
        return res.status(200).json(isExistingRequest._id)
    }
    
})

export {getUserRequests,createRequest,handleRequest}