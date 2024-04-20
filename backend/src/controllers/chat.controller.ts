import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { IUser } from "../interfaces/user.interface.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import type { addMemberToChatType, createChatSchemaType } from "../schemas/chat.schema.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";

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

const getUserChats = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const chats=await Chat.find({members:{$in:[req.user?._id]}})
    res.status(200).json(chats)
})

const addMemberToChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {members}:addMemberToChatType = req.body

    const isExistingChat = await Chat.findById(id)

    if(!isExistingChat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!isExistingChat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot add members",400))
    }

    if(isExistingChat.admin?._id.toString() !== req.user?._id.toString()){
        return next(new CustomError("You are not allowed to add members as you are not the admin of this chat",400))
    }

    const isValidMemberIdsPromise = members.map(memberId=>User.findById(memberId,'_id'))
    const validMembers = await Promise.all(isValidMemberIdsPromise) as Array<Pick<IUser, '_id'>>

    const existingMemberIds = validMembers.filter(({_id})=>isExistingChat.members.includes(_id))

    if(existingMemberIds.length>0){
        return next(new CustomError(`[${existingMemberIds.map(id=>id._id)}], ${existingMemberIds.length==1?"this id":"these ids"} already exists in members of this chat`))
    }
    
    isExistingChat.members.push(...validMembers.map(id=>id._id))
    await isExistingChat.save()

    res.status(200).json(isExistingChat)

})

export { addMemberToChat, createChat, getUserChats };
