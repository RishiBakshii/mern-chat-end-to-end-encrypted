import { NextFunction, Request, Response } from "express";
import { type signupSchemaType } from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { generateOtp, sendToken } from "../utils/auth.util.js";
import type { loginSchemaType } from "../schemas/auth.schema.js";
import bcrypt from 'bcryptjs'
import type { forgotPasswordSchemaType } from "../schemas/auth.schema.js";
import { sendMail } from "../utils/email.util.js";
import { ResetPassword } from "../models/reset-password.model.js";
import { env } from "../schemas/env.schema.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/env.config.js";
import type { resetPasswordSchemaType } from "../schemas/auth.schema.js";
import { IUser } from "../interfaces/user.interface.js";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { Otp } from "../models/otp.model.js";

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

    const expirationTime = new Date(Date.now() + (parseInt(env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES) * 60 * 1000));

    const token = jwt.sign({_id:isValidUser._id.toString()},env.JWT_SECRET)
    const hashedToken = await bcrypt.hash(token,10)

    await ResetPassword.create({user:isValidUser._id,hashedToken,expiresAt:expirationTime})
    const resetUrl = `${config.clientUrl}?token=${token}&user=${isValidUser._id.toString()}`

    await sendMail(email,isValidUser.username,"resetPassword",resetUrl,undefined)

    res.status(200).json({message:`We have sent a password reset link on ${email}`})
})

const resetPassword = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {token,newPassword,userId}:resetPasswordSchemaType = req.body


    const doesPasswordResetExists = await ResetPassword.findOne({user:userId})

    if(!doesPasswordResetExists){
        return next(new CustomError("Password reset link is invalid",404))
    }

    const isValidUser = await User.findById(userId)

    if(!isValidUser){
        return next(new CustomError("User not found",404))
    }

    if(doesPasswordResetExists.expiresAt! < new Date){
        await doesPasswordResetExists.deleteOne()
        return next(new CustomError("Password reset link has been expired",400))
    }

    const decodedInfo = jwt.verify(token,env.JWT_SECRET) as IUser['_id']

    if(!decodedInfo || !decodedInfo._id || decodedInfo._id.toString()!==userId) {
        console.log(decodedInfo._id);
        return next(new CustomError("Password reset link is invalid",400))
    }

    isValidUser.password = await bcrypt.hash(newPassword,10)
    await isValidUser.save()

    await ResetPassword.deleteMany({user:decodedInfo._id})

    return res.status(200).json({message:`Dear ${isValidUser.username}, your password has been reset successfuly`})

})

const sendOtp = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    await Otp.deleteMany({user:req.user?._id})

    const otp = generateOtp()
    const hashedOtp = await bcrypt.hash(otp,10)

    const newOtp = await Otp.create({user:req.user?._id,hashedOtp})

    await sendMail(req.user?.email!,req.user?.username!,"OTP",undefined,otp)

    return res.status(201).json({message:`We have sent the otp on ${req.user?.email}`})
})

const logout = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("token").status(200).json({message:"Logout successful"})
})


export {signup,login,logout,forgotPassword,resetPassword,sendOtp}