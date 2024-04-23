import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { Request } from "../models/request.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";

const getUserRequests = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const requests = await Request.find({receiver:req.user?._id})
    return res.status(200).json(requests)
})


export {getUserRequests}