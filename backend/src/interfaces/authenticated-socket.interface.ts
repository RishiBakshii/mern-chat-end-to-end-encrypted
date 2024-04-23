
import type { Socket } from "socket.io";
import type { IUser } from "./user.interface.js";

export interface AuthenticatedSocket extends Socket {
    user?:IUser
}