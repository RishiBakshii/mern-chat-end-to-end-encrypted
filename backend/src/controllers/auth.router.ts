import { NextFunction, Request, Response } from "express";
import type { signupSchemaType } from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import { CustomError } from "../utils/error.utils.js";
import { sendToken } from "../utils/auth.util.js";


const signup = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {username,password,avatar,email,name}:signupSchemaType=req.body

        const isExistingUser = await User.findOne({email})

        if(isExistingUser){
            return next(new CustomError("User already exists",400))
        }

        const existingUsername = await User.findOne({username})

        if(existingUsername){
            return next(new CustomError("Username is already taken",400))
        }

        const newUser = await User.create({avatar,email,name,password,username})
        
        sendToken(res,newUser._id,201,newUser)

    } catch (error) {
        console.log(error);
    }
} 


export {signup}