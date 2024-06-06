import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import { createServer } from 'http'
import morgan from 'morgan'
import passport from 'passport'
import { Server } from 'socket.io'
import './config/cloudinary.config.js'
import { connectDB } from './config/db.config.js'
import { config } from './config/env.config.js'
import type { AuthenticatedSocket, IUser } from './interfaces/auth/auth.interface.js'
import type { IMessage } from './interfaces/message/message.interface.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import './passport/github.strategy.js'
import './passport/google.strategy.js'
import { env } from './schemas/env.schema.js'

import attachmentRoutes from './routes/attachment.router.js'
import authRoutes from './routes/auth.router.js'
import chatRoutes from './routes/chat.router.js'
import friendRoutes from './routes/friend.router.js'
import messageRoutes from './routes/message.router.js'
import requestRoutes from './routes/request.router.js'
import userRoutes from './routes/user.router.js'

import { Types } from 'mongoose'
import { messaging } from './config/firebase.config.js'
import { Events } from './enums/event/event.enum.js'
import { ICallAcceptEventReceiveData, ICallInRequestEventPayloadData, ICallOutEventReceiveData } from './interfaces/callIn/callIn.interface.js'
import { IUnreadMessageEventPayload } from './interfaces/unread-message/unread-message.interface.js'
import { socketAuthenticatorMiddleware } from './middlewares/socket-auth.middleware.js'
import { Chat } from './models/chat.model.js'
import { Message } from './models/message.model.js'
import { UnreadMessage } from './models/unread-message.model.js'
import { User } from './models/user.model.js'
import { getRandomIndex } from './utils/generic.js'
import { notificationTitles } from './constants/notification-title.contant.js'


const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{credentials:true,origin:config.clientUrl}})

// database connection
connectDB()

// global
app.set("io",io)

// userSocketIds
export const userSocketIds = new Map()

// middlewares
app.use(cors({credentials:true,origin:config.clientUrl}))
app.use(passport.initialize())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))


// route middlewares
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/request",requestRoutes)
app.use("/api/v1/message",messageRoutes)
app.use("/api/v1/friend",friendRoutes)
app.use("/api/v1/attachment",attachmentRoutes)

io.use(socketAuthenticatorMiddleware)

// socket
io.on("connection",async(socket:AuthenticatedSocket)=>{

    await User.findByIdAndUpdate(socket.user?._id,{isActive:true})

    userSocketIds.set(socket.user?._id.toString(),socket.id)

    socket.broadcast.emit(Events.ONLINE,socket.user?._id)

    const onlineUserIds = Array.from(userSocketIds.keys());
    socket.emit(Events.ONLINE_USERS, onlineUserIds);

    const userChats = await Chat.find({"members":socket.user?._id},{"_id":1})
    const chatIds = userChats.map(userChat=>userChat._id.toString())
    socket.join(chatIds)


    socket.on(Events.MESSAGE,async({chat,content,url,isPoll,pollQuestion,pollOptions,isMultipleAnswers}:Omit<IMessage , "sender" | "chat" | "attachments"> & {chat:string})=>{

        // save to db
        const newMessage = await Message.create({chat,content,sender:socket.user?._id,url,isPoll,pollQuestion,pollOptions,isMultipleAnswers})
        await Chat.findByIdAndUpdate(chat,{latestMessage:newMessage._id})
        
        const transformedMessage  = await Message.aggregate([
            {
                $match:{
                    chat:new Types.ObjectId(chat),
                    _id:newMessage._id
                }
            },
            {
                $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
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
            {
                $addFields: {
                    sender: {
                        $arrayElemAt: ["$sender", 0],
                    },
                },
            },
            {
                $addFields: {
                    "attachments":"$attachments.secureUrl"
                },
            },
            {
                $unwind:{
                    path:"$pollOptions",
                    preserveNullAndEmptyArrays:true,
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"pollOptions.votes",
                    foreignField:"_id",
                    as:"pollOptions.votes",
                    pipeline:[
                        {
                            $project:{
                                username:1,
                                avatar:"$avatar.secureUrl"
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                  _id: "$_id",  // Group by the original message _id
                  sender: { $first: "$sender" },  // Keep the first sender object
                  chat: { $first: "$chat" },  // Keep the first chat ID
                  isPoll: { $first: "$isPoll" },  // Keep the first isPoll flag
                  content:{$first:'$content'},
                  url:{$first:'$url'},
                  pollQuestion: { $first: "$pollQuestion" }, // Keep the first pollQuestion
                  pollOptions: {
                    $push: "$pollOptions"  // Push each unwound pollOption into the array
                  },
                  isMultipleAnswers: { $first: "$isMultipleAnswers" },
    
                  attachments: { $first: "$attachments" },  // Keep the first attachments array (optional)
                  createdAt: { $first: "$createdAt" },  // Keep the first createdAt timestamp
                  updatedAt: { $first: "$updatedAt" },  // Keep the first updatedAt timestamp
                }
            },
            {
                $sort:{
                    'createdAt':1
                }
            }
        ])

        io.to(chat).emit(Events.MESSAGE,transformedMessage[0])

        // Handle unread messages for receivers
        const currentChat = await Chat.findById(chat,{members:1,_id:0}).populate<{members:Array<IUser>}>('members')
        
        if(currentChat){
            const currentChatMembers = currentChat.members.filter(member=>member._id.toString()!==socket.user?._id.toString())
            
            const updateOrCreateUnreadMessagePromise = currentChatMembers.map(async(member)=>{

                if(!member.isActive && member.fcmToken){
                    messaging.send({
                        token:member.fcmToken,
                        notification:{
                            imageUrl:socket.user?.avatar?.secureUrl,
                            title:`Hey ${member.username} ${notificationTitles[getRandomIndex(notificationTitles.length)]}`,
                            body:`new message from ${socket.user?.username.toLocaleUpperCase()}`
                        },
                    })
                }
    
                const isExistingUnreadMessage = await UnreadMessage.findOne({chat,user:member._id})
    
                if(isExistingUnreadMessage){
                    isExistingUnreadMessage.count? isExistingUnreadMessage.count++ : null
                    isExistingUnreadMessage.message = newMessage._id
                    isExistingUnreadMessage.save()
                    return isExistingUnreadMessage
                }
    
               return UnreadMessage.create({chat,user:member._id,sender:socket.user?._id,message:newMessage._id})
    
            })

            await Promise.all(updateOrCreateUnreadMessagePromise)
    
            const messageData:IUnreadMessageEventPayload['message'] = {}
    
            if(newMessage.isPoll){
                messageData.poll=true
            }
            
            if(newMessage.url){
                messageData.url=true
            }
    
            if(newMessage.content?.length){
                messageData.content=newMessage.content
            }

            const unreadMessageData:IUnreadMessageEventPayload = {
                chatId:chat,
                message:messageData,
                sender:transformedMessage[0].sender
            }
    
            io.to(chat).emit(Events.UNREAD_MESSAGE,unreadMessageData)
        }

    })

    socket.on(Events.MESSAGE_SEEN,async({chatId}:{chatId:string})=>{

        const areUnreadMessages = await UnreadMessage.findOne({chat:chatId,user:socket.user?._id})   

        if(areUnreadMessages){
            areUnreadMessages.count=0
            areUnreadMessages.readAt=new Date()
            await areUnreadMessages.save()
        }

        io.to(chatId).emit(Events.MESSAGE_SEEN,{

            user:{
                _id:socket.user?._id,
                username:socket.user?.username,
                avatar:socket.user?.avatar?.secureUrl
            },
            chat:chatId,
            readAt:areUnreadMessages?.readAt,
        })

    })

    socket.on(Events.MESSAGE_EDIT,async({messageId,updatedContent,chatId}:{messageId:string,updatedContent:string,chatId:string})=>{
        
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            {isEdited:true,content:updatedContent},
            {new:true,projection:['chat','content','isEdited']}
        )

        io.to(chatId).emit(Events.MESSAGE_EDIT,updatedMessage)
    })

    socket.on(Events.MESSAGE_DELETE,async({messageId}:{messageId:string})=>{

        const deletedMessage = await Message.findByIdAndDelete(messageId)

        if(deletedMessage){
            io.to(deletedMessage.chat._id.toString()).emit(Events.MESSAGE_DELETE,{messageId,chatId:deletedMessage.chat._id.toString()})
        }
    })

    socket.on(Events.USER_TYPING,({chatId}:{chatId:string})=>{
        
        socket.broadcast.to(chatId).emit(Events.USER_TYPING,{
            user:{
                _id:socket.user?._id.toString(),
                username:socket.user?.username,
                avatar:socket.user?.avatar?.secureUrl
            },
            chatId:chatId
        })
    })

    socket.on(Events.VOTE_IN,async({chatId,messageId,optionIndex}:{chatId:string,messageId:string,optionIndex:number})=>{
        
        const message = await Message.findOneAndUpdate(
            { chat: chatId, _id: messageId },
            {"$addToSet":{[`pollOptions.${optionIndex}.votes`]:socket.user?._id}},
            { new: true ,projection:["chat","_id"]}
        )
        
        const userInfo = {
            _id:socket.user?._id,
            avatar:socket.user?.avatar?.secureUrl,
            username:socket.user?.username
        }
        
        const payload = {
            _id:message?._id,
            optionIndex,
            user:userInfo
        }

        io.to(chatId).emit(Events.VOTE_IN,payload)

    })

    socket.on(Events.VOTE_OUT,async({chatId,messageId,optionIndex}:{chatId:string,messageId:string,optionIndex:number})=>{
        
        const message = await Message.findOneAndUpdate(
            { chat: chatId, _id: messageId },
            {"$pull":{[`pollOptions.${optionIndex}.votes`]:socket.user?._id}},
            { new: true ,projection:["chat","_id"]}
        )
        
        const userInfo = {
            _id:socket.user?._id,
        }
        
        const payload = {
            _id:message?._id,
            optionIndex,
            user:userInfo
        }

        io.to(chatId).emit(Events.VOTE_OUT,payload)

    })

    socket.on(Events.CALL_IN_REQUEST,async({callee,chat}:ICallInRequestEventPayloadData)=>{

        const payload = {
            caller:{
                _id:socket.user?._id,
                avatar:socket.user?.avatar?.secureUrl,
                username:socket.user?.username
            },
            chat,
        }

        io.to(userSocketIds.get(callee)).emit(Events.CALL_IN_REQUEST,payload)        

    })

    socket.on(Events.CALL_IN_REJECT,(callerId:string)=>{
        const payload = {
            callee:{
                _id:socket.user?._id,
                avatar:socket.user?.avatar?.secureUrl,
                username:socket.user?.username
            }
        }

        io.to(userSocketIds.get(callerId)).emit(Events.CALL_IN_REJECT,payload)
    })

    socket.on(Events.CALL_IN_ACCEPT,async({callerId,chat}:ICallAcceptEventReceiveData)=>{

        socket.join(chat.chatId)

        const spectatorData = {
            _id:socket.user?._id,
            username:socket.user?.username,
            avatar:socket.user?.avatar?.secureUrl,
            chatId:chat.chatId,
            callerId,
        }
        
        const chatData = {
            chatId:chat.chatId,
            name:chat.name,
            avatar:chat.avatar,
            messages:[],
            unreadMessages:[]
        }

        io.to(socket.id).emit(Events.CALL_IN_ACCEPT,chatData)

        io.to(chat.chatId).emit(Events.SPECTATOR_JOINED,spectatorData)

    })

    socket.on(Events.CALL_OUT,({callee,chat}:ICallOutEventReceiveData)=>{

        console.log({callee,chat});
        const payload = {
            caller:{
                _id:socket.user?._id,
                avatar:socket.user?.avatar?.secureUrl,
                username:socket.user?.username
            },
            callee,
            chat,
        }
        
        io.to(chat.chatId).emit(Events.CALL_OUT,payload)

        io.to(userSocketIds.get(callee._id)).socketsLeave(chat.chatId);
    })

    socket.on("disconnect",async()=>{
        await User.findByIdAndUpdate(socket.user?._id,{isActive:false})
        userSocketIds.delete(socket.user?._id);
        socket.broadcast.emit(Events.OFFLINE,socket.user?._id)
    })
})

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({running:true})
})


// error middleware
app.use(errorMiddleware)

if (import.meta.url.endsWith('dist/index.js')) {
    
    server.listen(env.PORT,()=>{
        console.log(`server [STARTED] ~ http://localhost:${env.PORT}`);
    })
}


export default server;
