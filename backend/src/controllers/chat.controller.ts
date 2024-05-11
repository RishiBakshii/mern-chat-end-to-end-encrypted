import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import type { IUser } from "../interfaces/auth/auth.interface.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import type { addMemberToChatType, createChatSchemaType, removeMemberfromChatType } from "../schemas/chat.schema.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { Message } from "../models/message.model.js";
import { emitEvent, getOtherMembers } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { uploadFilesToCloudinary } from "../utils/auth.util.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
import { UploadApiResponse } from "cloudinary";

const createChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    let uploadResults:UploadApiResponse[] = []

    const addUnreadMessagesStage = {
      $addFields: {
        unreadMessages: {
          count: 0,
          message: {
            _id: "",
            content: "",
          },
          sender: {
            _id: "",
            username: "",
            avatar: "",
          },
        },
        userTyping: [],
        seenBy: [],
      },
    }

    const {isGroupChat,members,avatar,name}:createChatSchemaType = req.body

    if(isGroupChat==='true'){

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
            uploadResults = await uploadFilesToCloudinary([req.file])
        }

        const newGroupChat = await Chat.create({
            avatar:{
                secureUrl:uploadResults[0]?.secure_url?uploadResults[0].secure_url:DEFAULT_AVATAR,
                publicId:uploadResults[0]?.public_id?uploadResults[0].public_id:null
            },
            isGroupChat,
            members:membersWithReqUser,
            admin:req.user?._id,
            name
        })

        const transformedChat = await Chat.aggregate(
        [
          {
            $match: {
              _id: newGroupChat._id,
            },
          },
          {
            $addFields: {
              avatar: "$avatar.secureUrl",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "members",
              foreignField: "_id",
              as: "members",
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
          addUnreadMessagesStage
        ])
        
        const membersIdsInString:Array<string> = newGroupChat.members.map(member=>member._id.toString())

        const otherMembers = getOtherMembers({members:membersIdsInString,user:req.user?._id.toString()!})
        
        emitEvent(req,Events.NEW_GROUP,otherMembers,transformedChat)
        
        return res.status(201).json(transformedChat)

    }

    else if(isGroupChat==='false'){

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


        const transformedChat = await Chat.aggregate([
          {
            $match:{
              _id:normalChat._id
            }
          },

          {
            $lookup:{
              from:"users",
              localField:"members",
              foreignField:"_id",
              as:"members",
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
                }
              ]
            }
          },
          addUnreadMessagesStage
        ])

        const memberStringIds = normalChat.members.map(member=>member._id.toString())
        const otherMembers = getOtherMembers({members:memberStringIds,user:req.user?._id.toString()!})

        emitEvent(req,Events.NEW_GROUP,otherMembers,transformedChat)
        
        return res.status(201).json(transformedChat)
    }

})

const getUserChats = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const chats = await Chat.aggregate([

        {
          $match: {
            members: req.user?._id,
          },
        },

        {
            $addFields: {
                avatar: "$avatar.secureUrl"
            } 
        },

        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "members",
            pipeline: [
              {
                $project: {
                  username: 1,
                  avatar: 1,
                },
              },
              {
                $addFields: {
                  avatar: "$avatar.secureUrl",
                },
              },
            ],
          },
        },

        {
          $lookup: {
            from: "unreadmessages",
            let: {
              chatId: "$_id",
              userId: req.user?._id,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$chat", "$$chatId"] },
                      { $eq: ["$user", "$$userId"] },
                    ],
                  },
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
                      $project: {
                        username: 1,
                        avatar: 1,
                      },
                    },
                  ],
                },
              },
              {
                $lookup: {
                  from: "messages",
                  localField: "message",
                  foreignField: "_id",
                  as: "message",
                  pipeline: [
                    {
                      $project: {
                        content: 1,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  count: 1,
                  message: 1,
                  sender: 1,
                },
              },
            ],
            as: "unreadMessages",
          },
        },
      
        {
          $addFields: {
            unreadMessages: {
              $arrayElemAt: ["$unreadMessages", 0],
            },
          },
        },
        {
          $addFields: {
            "unreadMessages.sender":{$arrayElemAt:['$unreadMessages.sender',0]},
            "unreadMessages.message":{$arrayElemAt:['$unreadMessages.message',0]},
            seenBy: [],
            userTyping: [],
          },
        },
        {
          $addFields: {
            "unreadMessages.sender.avatar": "$unreadMessages.sender.avatar.secureUrl"
          }
        }
      ])

    return res.status(200).json(chats)

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
    return res.status(200).json(member)

})

export { addMemberToChat, createChat, getUserChats, removeMemberFromChat };
