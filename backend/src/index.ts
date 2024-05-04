import express, { Request, Response, json } from 'express'
import {createServer} from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/env.config.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { connectDB } from './config/db.config.js'
import { env } from './schemas/env.schema.js'
import type { AuthenticatedSocket } from './interfaces/authenticated-socket.interface.js'
import type { IMessage } from './interfaces/message.interface.js'
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
import { Events } from './enums/event.enum.js'
import { Message } from './models/message.model.js'
import { UnreadMessage } from './models/unread-message.model.js'
import { IUnreadMessage } from './interfaces/unread-message.interface.js'
import { IChat, IMemberDetails } from './interfaces/chat.interface.js'
import { emitEvent, getMemberSockets, getOtherMembers } from './utils/socket.util.js'


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

    socket.on(Events.MESSAGE,async({chat,content,attachments,members}:Omit<IMessage , "sender"> & {members : Array<string>})=>{

        // save to db
        const newMessage = await (await Message.create({chat,content,attachments,sender:socket.user?._id})).populate<{sender:IMemberDetails}>("sender",['avatar','username'])
        
        // realtime response
        const memberSocketIds = getMemberSockets(members)
        io.to(memberSocketIds).emit(Events.MESSAGE,{
            
            _id: newMessage._id,
            content: newMessage.content,
            sender: {
                _id: newMessage.sender._id,
                avatar: newMessage.sender.avatar.secureUrl,
                username: newMessage.sender.username
            },
            chat: newMessage.chat.toString(),
            attachments: newMessage.attachments,
            createdAt: newMessage.createdAt,
            updatedAt:  newMessage.updatedAt
              
        })

        // unread message creation for receivers
        const memberIds = getOtherMembers({members,user:socket.user?._id.toString()!})
        const otherMemberSockets = getMemberSockets(memberIds)
        const updateOrCreateUnreadMessagePromise = memberIds.map(async(memberId)=>{

            const isExistingUnreadMessage = await UnreadMessage.findOne({chat,user:memberId})

            if(isExistingUnreadMessage){
                isExistingUnreadMessage.count++
                isExistingUnreadMessage.message = newMessage._id
                isExistingUnreadMessage.save()
                return isExistingUnreadMessage
            }

           return UnreadMessage.create({chat,count:1,user:memberId,sender:socket.user?._id,message:newMessage._id})

        })

        await Promise.all(updateOrCreateUnreadMessagePromise)
        io.to(otherMemberSockets).emit(Events.UNREAD_MESSAGE,{chatId:chat,message:{_id:newMessage._id.toString(),content:newMessage.content.substring(0,30)},sender:newMessage.sender})

    })

    socket.on(Events.MESSAGE_SEEN,async({chatId,members}:{chatId:string,members:Array<string>})=>{

        const areUnreadMessages = await UnreadMessage.findOne({chat:chatId,user:socket.user?._id})   

        if(areUnreadMessages){
            areUnreadMessages.count=0
            areUnreadMessages.readAt=new Date()
            await areUnreadMessages.save()
        }

        const memberSocketIds = getMemberSockets(members)
        io.to(memberSocketIds).emit(Events.MESSAGE_SEEN,{user:{_id:socket.user?._id,username:socket.user?.username,avatar:socket.user?.avatar},readAt:areUnreadMessages?.readAt,chat:chatId})

    })

    socket.on(Events.USER_TYPING,({chatId,members}:{chatId:string,members:Array<string>})=>{
        const otherMembers = getOtherMembers({members,user:socket.user?._id.toString()!})
        const otherMemberSockets = getMemberSockets(otherMembers)

        io.to(otherMemberSockets).emit(Events.USER_TYPING,{
            user:{
                _id:socket.user?._id.toString(),
                username:socket.user?.username,
                avatar:socket.user?.avatar
            },
            chatId:chatId
        })
    })

    socket.on("disconnect",()=>{
        console.log(`${socket.user?.name} left`);
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
