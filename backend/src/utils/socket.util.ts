import { Server } from "socket.io";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import type { Events } from "../enums/event.enum.js";
import { userSocketIds } from "../index.js";

export const emitEvent = (req:AuthenticatedRequest,event:Events,users:Array<string>,data:unknown)=>{
    const io:Server = req.app.get("io")
    io.to(users).emit(event,data)
}

export const getOtherMembers=({members,user}:{members:Array<string>,user:string})=>{
    return members.filter(member=>member!==user)
}

export const getMemberSockets = (members:Array<string>)=>{
    return members.map(member=>userSocketIds.get(member))
}