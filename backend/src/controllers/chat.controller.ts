import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import type { createChatSchemaType } from "../schemas/chat.schema.js";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { NextFunction, Response } from "express";
import { Chat } from "../models/chat.model.js";

const createChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {isGroupChat,members,avatar,name}:createChatSchemaType = req.body

    if(isGroupChat){

        if(members.length<2){
            return next(new CustomError("Atleast 2 members are required to create group chat",400))
        }
        else if(!name){
            return next(new CustomError("name is required for creating group chat",400))
        }
        
        const membersWithReqUser=[...members,req.user?._id]

        const isExistingGroupChat = await Chat.findOne({
            members: { $all: membersWithReqUser, $size: membersWithReqUser.length },
          });
        
        if(isExistingGroupChat){
            return next(new CustomError("group chat already exists",400))
        }

        const newGroupChat = await Chat.create({avatar:avatar?avatar:"defaultAvatar",isGroupChat,members:membersWithReqUser,admin:req.user?._id,name})
        res.status(201).json(newGroupChat)

    }

    else if(!isGroupChat){

        if(members.length>1){
            return next(new CustomError("normal chat cannot have more than 1 member",400))
        }

        if(name){
            return next(new CustomError("Name cannot be assigned to a normal chat",400))
        }
        else if(avatar){
            return next(new CustomError("Avatar cannot be assigned to a normal chat",400))
        }
        
        const membersWithReqUser=[...members,req.user?._id]

        const isExistingChat = await Chat.findOne({
            members: { $all: membersWithReqUser, $size: membersWithReqUser.length },
          });

        if(isExistingChat){
            return next(new CustomError("Chat already exists",400))
        }

        const normalChat = await Chat.create({members:[...members,req.user?._id]})
        res.status(201).json(normalChat)
    }

})

export {createChat}