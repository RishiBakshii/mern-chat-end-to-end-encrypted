import express, { Request, Response, json } from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/env.config.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { connectDB } from './config/db.config.js'
import { env } from './schemas/env.schema.js'


const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{credentials:true,origin:config.clientUrl}})

// database connection
connectDB()

// middlewares
app.use(cors({credentials:true,origin:config.clientUrl}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({running:true})
})


// error middleware
app.use(errorMiddleware)

server.listen(env.PORT,()=>{
    console.log(`server [STARTED] ~ http://localhost:${env.PORT}`);
})
