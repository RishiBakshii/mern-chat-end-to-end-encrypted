import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { IAvatar, IUser } from "../interfaces/user.interface.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import type { addMemberToChatType, createChatSchemaType, removeMemberfromChatType } from "../schemas/chat.schema.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { Message } from "../models/message.model.js";
import { emitEvent, getMemberSockets, getOtherMembers } from "../utils/socket.util.js";
import { Events } from "../enums/event.enum.js";
import { UnreadMessage } from "../models/unread-message.model.js";
import { IChatWithUnreadMessages } from "../interfaces/chat.interface.js";
import { IMessage } from "../interfaces/message.interface.js";
import { uploadFilesToCloudinary } from "../utils/auth.util.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";

const createChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    let secureUrl:string=''

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

        if(req.file){
            const result = await uploadFilesToCloudinary([req.file])
            secureUrl = result[0].secure_url
        }
        const newGroupChat = await Chat.create({
            avatar:secureUrl?secureUrl:DEFAULT_AVATAR,
            isGroupChat,members:membersWithReqUser,
            admin:req.user?._id,name
        })

        await newGroupChat.populate("members",['username','avatar'])

        const otherMembers = getOtherMembers({members: newGroupChat.members.map(member=>member._id.toString()),user:req.user?._id.toString()!})
        
        const transformedChat = {
            _id:newGroupChat._id,
            name:newGroupChat.name,
            isGroupChat:newGroupChat.isGroupChat,
            members:newGroupChat.members,
            avatar:newGroupChat.avatar,
            admin:newGroupChat.admin,
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
        }
        emitEvent(req,Events.NEW_GROUP,otherMembers,transformedChat)
        
        return res.status(201).json(transformedChat)

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

        const otherMembers = getOtherMembers({members:normalChat.members.map(member=>member._id.toString()),user:req.user?._id.toString()!})
        emitEvent(req,Events.NEW_GROUP,getMemberSockets(otherMembers),normalChat)
        
        return res.status(201).json(normalChat)
    }

})

const getUserChats = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const chats=await Chat.find({members:{$in:[req.user?._id]}}).populate<{members:Array<{_id:string,username:string,avatar:IAvatar}>}>("members",['username','avatar'])

    const transformedChatsPromise = chats.map(async(chat)=>{
        
        const unreadMessage = await UnreadMessage.findOne({chat:chat._id,user:req.user?._id}).select("-chat").select("-user")
        .populate<{message:Pick<IMessage, '_id' | 'content'>}>("message",['content'])
        .populate<{sender:Pick<IUser, "username" | 'avatar'> & {_id:string}}>("sender",["username","avatar"])
        
        const chatWithUnreadMessage:IChatWithUnreadMessages = {
            _id:chat._id,
            name:chat.name,
            members:chat.members.map((member)=>{
                return {
                    _id:member._id,
                    avatar:member.avatar.secureUrl,
                    username:member.username
                }
            }),
            admin:chat.admin,
            isGroupChat:chat.isGroupChat,
            avatar:chat.avatar,
            unreadMessages:{
                count:unreadMessage?.count,
                message:{
                    _id:unreadMessage?.message._id,
                    content:unreadMessage?.message.content
                },
                sender:{
                    _id:unreadMessage?.sender._id,
                    username:unreadMessage?.sender.username,
                    avatar:unreadMessage?.sender.avatar?.secureUrl
                },
            }
        }
        
        return chatWithUnreadMessage

    })

    const transformedChats = await Promise.all(transformedChatsPromise)

    res.status(200).json(transformedChats)
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

const removeMemberFromChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const {id}=req.params
    const {member}:removeMemberfromChatType = req.body

    const isExistingChat = await Chat.findById(id)

    if(!isExistingChat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!isExistingChat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot add members",400))
    }

    if(req.user?._id.toString() !== isExistingChat.admin?._id.toString()){
        return next(new CustomError("You are not allowed to remove members as you are not the admin of this chat",400))
    }
    
    const isValidMemberId = await User.findById(member,'_id')

    if(!isValidMemberId){
        return next(new CustomError("Member id not valid",404))
    }

    const isGroupMember = isExistingChat.members.findIndex(chatMember => chatMember._id.toString() === member.toString())

    if(isGroupMember === -1){
        return next(new CustomError("Member is not a part of the group"))
    }

    if(isExistingChat.members.length===3){
        await isExistingChat.deleteOne()
        await Message.deleteMany({chat:isExistingChat._id})
        return res.status(200).json({_id:isExistingChat._id})
    }


    if(member.toString() === isExistingChat.admin?._id.toString()){

        const adminIdIndex = isExistingChat.members.findIndex(chatMember=>chatMember._id.toString() === member)
        isExistingChat.members.splice(adminIdIndex,1)

        isExistingChat.admin = isExistingChat.members[0]
        await isExistingChat.save()
        return res.status(200).json(isExistingChat)
    }

    const memberToBeRemovedIndex = isExistingChat.members.findIndex(chatMember => chatMember._id.toString() === member)
    isExistingChat.members.splice(memberToBeRemovedIndex,1)
    await isExistingChat.save()
    return res.status(200).json(isExistingChat)


})

export { addMemberToChat, createChat, getUserChats, removeMemberFromChat };
