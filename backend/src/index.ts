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

import authRoutes from './routes/auth.router.js'
import chatRoutes from './routes/chat.router.js'
import userRoutes from './routes/user.router.js'
import requestRoutes from './routes/request.router.js'

import { socketAuthenticatorMiddleware } from './middlewares/socket-auth.middleware.js'
import { Events } from './enums/event.enum.js'
import { Message } from './models/message.model.js'
import { UnreadMessage } from './models/unread-message.model.js'


const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{credentials:true,origin:'*'}})

// database connection
connectDB()

// userSocketIds
const userSocketIds = new Map()

// middlewares
app.use(cors({credentials:true,origin:"*"}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))


// route middlewares
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/request",requestRoutes)

io.use(socketAuthenticatorMiddleware)

// socket
io.on("connection",(socket:AuthenticatedSocket)=>{

    userSocketIds.set(socket.user?._id.toString(),socket.id)

    socket.on(Events.MESSAGE,async({chat,content,attachments,members}:Omit<IMessage , "sender"> & {members : Array<string>})=>{

        // save to db
        const newMessage = await Message.create({chat,content,attachments,sender:socket.user?._id})
        
        // realtime response
        const memberIds = members.filter(member=>member!==socket.user?._id.toString())
        const memberSocketsIds = memberIds.map(memberId=>userSocketIds.get(memberId))
        io.to(memberSocketsIds).emit(Events.MESSAGE,newMessage)

        // unread message creation for receivers
        const updateOrCreateUnreadMessagePromise = memberIds.map(async(memberId)=>{

            const isExistingUnreadMessage = await UnreadMessage.findOne({chat,user:memberId})

            if(isExistingUnreadMessage){
                isExistingUnreadMessage.count++
                isExistingUnreadMessage.save()
                return isExistingUnreadMessage
            }

           return UnreadMessage.create({chat,count:1,user:memberId})

        })

        await Promise.all(updateOrCreateUnreadMessagePromise)
        io.to(memberSocketsIds).emit(Events.UNREAD_MESSAGE,{chat,message:newMessage.content.substring(0,30)})

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
