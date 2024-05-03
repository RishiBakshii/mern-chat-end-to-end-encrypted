import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";

const getUserDetails = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    return res.status(200).json(req.user)
})

const getUserByUsername = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const {username} = req.query

    if(!username || !username?.toString().trim()){
        return next(new CustomError("Username cannot be empty"))
    }

    const searchTerm = new RegExp(`${username.toString().toLowerCase()}`,'i')

    const results = await User.find({username:searchTerm},{avatar:1,username:1,name:1},{fuzzy:true})

    return res.status(200).json(results)
    
})

export { getUserDetails ,getUserByUsername };
