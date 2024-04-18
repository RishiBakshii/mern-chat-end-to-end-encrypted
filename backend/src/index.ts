import express, { Request, Response, json } from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'


const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{origin:"*"}})


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({running:true})
})

server.listen(8000,()=>{
    console.log('server [STARTED] ~ http://localhost:8000');
})
