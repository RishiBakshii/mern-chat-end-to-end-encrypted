import { Request } from "express";
import type { IUser } from "./user.interface.js";

export interface AuthenticatedRequest extends Request {
    user?:IUser
}