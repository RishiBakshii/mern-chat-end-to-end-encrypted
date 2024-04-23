import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { asyncErrorHandler } from "../utils/error.utils.js";

const getUserDetails = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    return res.status(200).json(req.user)
})

export { getUserDetails };
