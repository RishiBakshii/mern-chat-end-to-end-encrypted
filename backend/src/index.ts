import express, { Request, Response } from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/env.config.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { connectDB } from './config/db.config.js'
import { env } from './schemas/env.schema.js'
import type { AuthenticatedSocket } from './interfaces/auth/auth.interface.js'
import type { IMessage, IMessageEventPayload } from './interfaces/message/message.interface.js'
import './config/cloudinary.config.js'
import passport from 'passport'
import './passport/google.strategy.js'
import './passport/github.strategy.js'

import authRoutes from './routes/auth.router.js'
import chatRoutes from './routes/chat.router.js'
import userRoutes from './routes/user.router.js'
import requestRoutes from './routes/request.router.js'
import messageRoutes from './routes/message.router.js'

import { socketAuthenticatorMiddleware } from './middlewares/socket-auth.middleware.js'
import { Events } from './enums/event/event.enum.js'
import { Message } from './models/message.model.js'
import { UnreadMessage } from './models/unread-message.model.js'
import { IMemberDetails } from './interfaces/chat/chat.interface.js'
import { getMemberSockets, getOtherMembers } from './utils/socket.util.js'
import { IUnreadMessageEventPayload } from './interfaces/unread-message/unread-message.interface.js'


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

io.use(socketAuthenticatorMiddleware)

// socket
io.on("connection",(socket:AuthenticatedSocket)=>{

    userSocketIds.set(socket.user?._id.toString(),socket.id)

    socket.broadcast.emit(Events.ONLINE,socket.user?._id)

    socket.on(Events.MESSAGE,async({chat,content,attachments,members,url}:Omit<IMessage , "sender"> & {members : Array<string>})=>{

        // save to db
        const newMessage = await new Message({chat,content,attachments,sender:socket.user?._id,url})
        .populate<{"sender":IMemberDetails}>("sender",['avatar',"username"])

        newMessage.save()
        
        // realtime response
        const realtimeMessageResponse:IMessageEventPayload = {
            _id: newMessage._id.toString(),
            content: newMessage.content,
            sender: {
                _id: newMessage.sender._id,
                avatar: newMessage.sender.avatar.secureUrl,
                username: newMessage.sender.username
            },
            chat: newMessage.chat?.toString(),
            url:newMessage.url,
            attachments: newMessage.attachments,
            createdAt: newMessage.createdAt,
            updatedAt:  newMessage.updatedAt
        }

        io.to(getMemberSockets(members)).emit(Events.MESSAGE,realtimeMessageResponse)

        // unread message creation for receivers
        const memberIds = getOtherMembers({members,user:socket.user?._id.toString()!})
        const otherMemberSockets = getMemberSockets(memberIds)


        const updateOrCreateUnreadMessagePromise = memberIds.map(async(memberId)=>{

            const isExistingUnreadMessage = await UnreadMessage.findOne({chat,user:memberId})

            if(isExistingUnreadMessage){
                isExistingUnreadMessage.count? isExistingUnreadMessage.count++ : null
                isExistingUnreadMessage.message = newMessage._id
                isExistingUnreadMessage.save()
                return isExistingUnreadMessage
            }

           return UnreadMessage.create({chat,user:memberId,sender:socket.user?._id,message:newMessage._id})

        })

        await Promise.all(updateOrCreateUnreadMessagePromise)

        const unreadMessageData:IUnreadMessageEventPayload = {
            chatId:chat._id?.toString(),
            message:{
                _id:newMessage._id.toString(),
                content:newMessage?.content?.substring(0,30)
            },
            sender:{
                _id:newMessage.sender._id,
                avatar:newMessage.sender.avatar.secureUrl,
                username:newMessage.sender.username
            }
        }
        io.to(otherMemberSockets).emit(Events.UNREAD_MESSAGE,unreadMessageData)

    })

    socket.on(Events.MESSAGE_SEEN,async({chatId,members}:{chatId:string,members:Array<string>})=>{

        const areUnreadMessages = await UnreadMessage.findOne({chat:chatId,user:socket.user?._id})   

        if(areUnreadMessages){
            areUnreadMessages.count=0
            areUnreadMessages.readAt=new Date()
            await areUnreadMessages.save()
        }

        const memberSocketIds = getMemberSockets(members)
        io.to(memberSocketIds).emit(Events.MESSAGE_SEEN,{

            user:{
                _id:socket.user?._id,
                username:socket.user?.username,
                avatar:socket.user?.avatar?.secureUrl
            },
            chat:chatId,
            readAt:areUnreadMessages?.readAt,
        })

    })

    socket.on(Events.USER_TYPING,({chatId,members}:{chatId:string,members:Array<string>})=>{
        const otherMembers = getOtherMembers({members,user:socket.user?._id.toString()!})
        const otherMemberSockets = getMemberSockets(otherMembers)

        io.to(otherMemberSockets).emit(Events.USER_TYPING,{
            user:{
                _id:socket.user?._id.toString(),
                username:socket.user?.username,
                avatar:socket.user?.avatar?.secureUrl
            },
            chatId:chatId
        })
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit(Events.OFFLINE,socket.user?._id)
    })
})

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({running:true})
})


// error middleware
app.use(errorMiddleware)

server.listen(env.PORT,()=>{
    console.log(`server [STARTED] ~ http://localhost:${env.PORT}`);
})
