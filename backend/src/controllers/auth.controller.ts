import { NextFunction, Request, Response } from "express";
import { type signupSchemaType } from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { sendToken } from "../utils/auth.util.js";
import type { loginSchemaType } from "../schemas/auth.schema.js";
import bcrypt from 'bcryptjs'
import type { forgotPasswordSchemaType } from "../schemas/auth.schema.js";
import { sendMail } from "../utils/email.util.js";
import { ResetPassword } from "../models/reset-password.model.js";
import { env } from "../schemas/env.schema.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/env.config.js";

const signup = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {username,password,avatar,email,name}:signupSchemaType=req.body

    const isExistingUser = await User.findOne({email})

    if(isExistingUser){
        return next(new CustomError("User already exists",400))
    }

    const existingUsername = await User.findOne({username})

    if(existingUsername){
        return next(new CustomError("Username is already taken",400))
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = await User.create({avatar,email,name,password:hashedPassword,username})
    
    sendToken(res,newUser._id,201,newUser)
}) 

const login = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}:loginSchemaType=req.body

    const isExistingUser = await User.findOne({email}).select("+password")

    if(isExistingUser && await bcrypt.compare(password,isExistingUser.password)){
        
        sendToken(res,isExistingUser['_id'],200,isExistingUser)
        return 
    }

    return next(new CustomError("Invalid Credentials",404))
    
})

const forgotPassword = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {email}:forgotPasswordSchemaType = req.body

    const isValidUser = await User.findOne({email})

    if(!isValidUser){
        return next(new CustomError("User with this email does not exists",404))
    }

    await ResetPassword.deleteMany({user:isValidUser._id})

    const expirationTime = Date.now() + (parseInt(env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES) * 60 * 1000)

    const token = jwt.sign(isValidUser._id.toString(),env.JWT_SECRET)
    const hashedToken = await bcrypt.hash(token,10)

    const newResetPasswordDoc = await ResetPassword.create({user:isValidUser._id,hashedToken,expiresAt:Date.now() + expirationTime})
    const resetUrl = `${config.clientUrl}?token=${newResetPasswordDoc.hashedToken}`

    await sendMail(email,isValidUser.username,resetUrl,"resetPassword")

    res.status(200).json({message:`We have sent a password reset link on ${email}`})
})

const logout = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("token").status(200).json({message:"Logout successful"})
})


export {signup,login,logout,forgotPassword}