import { NextFunction, Response } from "express";
import type { AuthenticatedRequest, IUser } from "../interfaces/auth/auth.interface.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import type { addMemberToChatType, createChatSchemaType, removeMemberfromChatType } from "../schemas/chat.schema.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { Message } from "../models/message.model.js";
import { emitEvent, getOtherMembers } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/auth.util.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
import { UploadApiResponse } from "cloudinary";
import { Types } from "mongoose";
import { IMemberDetails } from "../interfaces/chat/chat.interface.js";
import { UnreadMessage } from "../models/unread-message.model.js";


export const addUnreadMessagesStage = {
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
    userTyping: Array<[]>,
    seenBy: Array<[]>,
  },
}

export const populateMembersStage = {
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
}

export const updateAvatarFeild = {
  $addFields: {
    avatar: "$avatar.secureUrl",
  },
}

const createChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    let uploadResults:UploadApiResponse[] = []

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
          updateAvatarFeild,
          populateMembersStage,
          addUnreadMessagesStage
        ])
        
        const membersIdsInString:Array<string> = newGroupChat.members.map(member=>member._id.toString())

        const otherMembers = getOtherMembers({members:membersIdsInString,user:req.user?._id.toString()!})
        
        emitEvent(req,Events.NEW_GROUP,otherMembers,transformedChat[0])
        
        return res.status(201).json(transformedChat[0])

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
          populateMembersStage,
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

        updateAvatarFeild,
        populateMembersStage,
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

    const validMembers =  await User.aggregate([
      {
        $match:{
          _id:{$in:members.map(member=>new Types.ObjectId(member))}
        }
      },
      updateAvatarFeild,
      {
        $project:{
          username:1,
          avatar:1
        }
      }
    ]) as Array<IMemberDetails>


    const existingMembers = validMembers.filter(validMember=>isExistingChat.members.includes(new Types.ObjectId(validMember._id)))

    if(existingMembers.length){
        return next(new CustomError(`${existingMembers.map(member=>`${member.username}`)} already exists in members of this chat`,400))
    }
    
    isExistingChat.members.push(...validMembers.map(member=>new Types.ObjectId(member._id)))
    await isExistingChat.save()

    // Extract old members
    const newMemberIdsSet = new Set(members);
    const oldMembers = isExistingChat.members.filter(member => !newMemberIdsSet.has(member.toString()));

    const oldMemberIds = oldMembers.map(member=>member._id.toString())

    emitEvent(req,Events.NEW_MEMBER_ADDED,oldMemberIds,{
      chatId:isExistingChat._id,
      members:validMembers
    })

    const transformedChat = await Chat.aggregate([
      {
        $match:{
          _id:isExistingChat._id
        }
      },
      updateAvatarFeild,
      populateMembersStage,
      addUnreadMessagesStage

    ])

    emitEvent(req,Events.NEW_GROUP,members,transformedChat[0])

    res.status(200).json(validMembers)

})

const removeMemberFromChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {members}:removeMemberfromChatType = req.body

    const isExistingChat = await Chat.findById(id)

    if(!isExistingChat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!isExistingChat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot remove members",400))
    }

    if(req.user?._id.toString() !== isExistingChat.admin?._id.toString()){
        return next(new CustomError("You are not allowed to remove members as you are not the admin of this chat",400))
    }

    const existingChatMemberIds = isExistingChat.members.map(member=>member._id.toString())
    const invalidMemberIds = members.filter(member=>!existingChatMemberIds.includes(member))

    if(invalidMemberIds.length){
      return next(new CustomError("Please provide valid members to remove",400))
    }


    if(isExistingChat.members.length===3){

        const publicIdsToBeDestroyed:Array<string> = []

        if(isExistingChat.avatar?.publicId){
          publicIdsToBeDestroyed.push(isExistingChat.avatar.publicId)
        }

        const messageWithAttachements = await Message.find({chat:isExistingChat._id,attachments:{$ne:[]}})
        
        messageWithAttachements.forEach(message=>{

         if(message.attachments?.length){
           const attachmentsPublicId = message.attachments.map(attachment=>attachment.publicId)
           publicIdsToBeDestroyed.push(...attachmentsPublicId)
         }

        })

        const chatDeletePromise:Array<Promise<any>> = [
          isExistingChat.deleteOne(),
          Message.deleteMany({chat:isExistingChat._id}),
          UnreadMessage.deleteMany({chat:isExistingChat._id}),
          deleteFilesFromCloudinary(publicIdsToBeDestroyed)
        ]

        await Promise.all(chatDeletePromise)

        emitEvent(req,Events.DELETE_CHAT,existingChatMemberIds,{chatId:isExistingChat._id})

        return res.status(200).json()
    }

    const isAdminLeavingIndex = members.findIndex(member=>isExistingChat.admin?._id.toString()===member)
    
    if(isAdminLeavingIndex!==-1){
        isExistingChat.admin = isExistingChat.members[0]
    }

    isExistingChat.members = isExistingChat.members.filter(existingMember=>!members.includes(existingMember._id.toString()))
    await isExistingChat.save()

    emitEvent(req,Events.DELETE_CHAT,members,{chatId:isExistingChat._id})
    emitEvent(req,Events.MEMBER_REMOVED,existingChatMemberIds.filter(id=>!members.includes(id)),{chatId:isExistingChat._id,membersId:members})

    return res.status(200).json()

})

export { addMemberToChat, createChat, getUserChats, removeMemberFromChat };
