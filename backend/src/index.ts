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

import authRoutes from './routes/auth.router.js'
import chatRoutes from './routes/chat.router.js'
import userRoutes from './routes/user.router.js'
import { socketAuthenticatorMiddleware } from './middlewares/socket-auth.middleware.js'


const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{credentials:true,origin:'*'}})

// database connection
connectDB()

// middlewares
app.use(cors({credentials:true,origin:"*"}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))


// route middlewares
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/user",userRoutes)

io.use(socketAuthenticatorMiddleware)

// socket
io.on("connection",(socket:AuthenticatedSocket)=>{

    console.log(`${socket.user?.name} just connected with socket`);

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
