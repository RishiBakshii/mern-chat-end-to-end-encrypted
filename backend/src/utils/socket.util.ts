import { Server } from "socket.io";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import type { Events } from "../enums/event.enum.js";

export const emitEvent = (req:AuthenticatedRequest,event:Events,users:Array<string>,data:unknown)=>{
    const io:Server = req.app.get("io")
    io.to(users).emit(event,data)
}