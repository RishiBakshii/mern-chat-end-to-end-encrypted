import express, { Request, Response, json } from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'


const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{origin:"*"}})

// middlewares
app.use(cors({credentials:true,origin:""}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({running:true})
})

server.listen(8000,()=>{
    console.log('server [STARTED] ~ http://localhost:8000');
})
