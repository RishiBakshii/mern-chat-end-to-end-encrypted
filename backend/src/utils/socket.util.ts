import { Server } from "socket.io";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { Events } from "../enums/event/event.enum.js";
import { userSocketIds } from "../index.js";

export const emitEvent = (req:AuthenticatedRequest,event:Events,users:Array<string>,data:unknown)=>{
    const io:Server = req.app.get("io")
    io.to(getMemberSockets(users)).emit(event,data)
}


export const emitEventToRoom = (req:AuthenticatedRequest,event:Events,room:string,data:unknown)=>{
    const io:Server = req.app.get("io")
    io.to(room).emit(event,data)
}

export const getOtherMembers=({members,user}:{members:Array<string>,user:string})=>{
    return members.filter(member=>member!==user)
}

export const getMemberSockets = (members:Array<string>)=>{
    return members.map(member=>userSocketIds.get(member))
}