import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { Request } from "../models/request.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import type { createRequestSchemaType } from "../schemas/request.schema.js";
import { User } from "../models/user.model.js";

const getUserRequests = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const requests = await Request.find({receiver:req.user?._id})
    return res.status(200).json(requests)
})

const createRequest = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {receiver}:createRequestSchemaType = req.body

    const isValidReceiverId = await User.findById(receiver)

    if(!isValidReceiverId){
        return next(new CustomError("Receiver not found",404))
    }

    if(req.user?._id.toString() === receiver){
        return next(new CustomError("You cannot send a request to yourself",400))
    }

    const isAlreadyCreated = await Request.findOne({receiver,sender:req.user?._id})

    if(isAlreadyCreated){
        return next(new CustomError("Request is already sent",400))
    }

    const newRequest = await Request.create({receiver,sender:req.user?._id})
    return res.status(201).json(newRequest)

})

export {getUserRequests,createRequest}