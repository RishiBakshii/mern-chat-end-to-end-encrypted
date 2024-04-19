import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { env } from "../schemas/env.schema.js"
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js"
import { Payload } from "../interfaces/payload.interface.js"
import { User } from "../models/user.model.js"
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js"

export const verifyToken=asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

        const {token} = req.cookies

        if(!token){
            return next(new CustomError("Token missing, please login again"))
        }

        const decodedInfo=jwt.verify(token,env.JWT_SECRET) as Payload

        if(!decodedInfo || !decodedInfo._id){
            return next(new CustomError("Invalid token please login again"))
        }

        const existingUser = await User.findOne({_id:decodedInfo._id})

        if(!existingUser){
            return next(new CustomError('Invalid Token, please login again'))
        }

        req.user=existingUser
        next()
})