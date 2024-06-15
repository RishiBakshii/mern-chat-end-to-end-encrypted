import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/env.config.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
import type { AuthenticatedRequest, IUser, OAuthAuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { Otp } from "../models/otp.model.js";
import { PrivateKeyRecoveryToken } from '../models/private-key-recovery-token.model.js';
import { ResetPassword } from "../models/reset-password.model.js";
import { User } from "../models/user.model.js";
import type { fcmTokenSchemaType, forgotPasswordSchemaType, keySchemaType, loginSchemaType, resetPasswordSchemaType, setAuthCookieSchemaType, verifyOtpSchemaType, verifyPasswordSchemaType, verifyPrivateKeyTokenSchemaType } from "../schemas/auth.schema.js";
import { type signupSchemaType } from "../schemas/auth.schema.js";
import { env } from "../schemas/env.schema.js";
import { cookieOptions, generateOtp, generatePrivateKeyRecoveryToken, getSecureUserInfo, sendToken } from "../utils/auth.util.js";
import { sendMail } from "../utils/email.util.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";

const signup = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {username,password,email,name}:signupSchemaType=req.body
    

    const isExistingUser = await User.findOne({email})

    if(isExistingUser){
        return next(new CustomError("User already exists",400))
    }

    const existingUsername = await User.findOne({username})

    if(existingUsername){
        return next(new CustomError("Username is already taken",400))
    }

    const hashedPassword = await bcrypt.hash(password,10)


    const newUser = await User.create({email,name,password:hashedPassword,username,avatar:{
        secureUrl:DEFAULT_AVATAR
    }}) as IUser

    const secureInfo = getSecureUserInfo(newUser)

    sendToken(res,newUser._id,201,secureInfo)
    
}) 

const login = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}:loginSchemaType=req.body

    const isExistingUser = await User.findOne({email}).select("+password")

    if(isExistingUser && await bcrypt.compare(password,isExistingUser.password)){

        const secureInfo = getSecureUserInfo(isExistingUser)

        sendToken(res,isExistingUser['_id'],200,secureInfo)
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

    const token = jwt.sign({_id:isValidUser._id.toString()},env.JWT_SECRET)
    const hashedToken = await bcrypt.hash(token,10)

    await ResetPassword.create({user:isValidUser._id,hashedToken})
    const resetUrl = `${config.clientUrl}/auth/reset-password?token=${token}&user=${isValidUser._id.toString()}`

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

    await Otp.create({user:req.user?._id,hashedOtp})

    await sendMail(req.user?.email!,req.user?.username!,'OTP',undefined,otp,undefined)

    return res.status(201).json({message:`We have sent the otp on ${req.user?.email}`})
})

const verifyOtp = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {otp}:verifyOtpSchemaType = req.body

    const isOtpExisting = await Otp.findOne({user:req.user?._id})

    if(!isOtpExisting){
        return next(new CustomError("Otp does not exists",404))
    }

    if(isOtpExisting.expiresAt! < new Date){
        await isOtpExisting.deleteOne()
        return next(new CustomError("Otp has been expired",400))
    }

    if(!(await bcrypt.compare(otp,isOtpExisting.hashedOtp))){
        return next(new CustomError("Otp is invalid",400))
    }

    await isOtpExisting.deleteOne()
    const verifiedUser = await User.findByIdAndUpdate(req.user?._id,{verified:true},{new:true}) as IUser
    return res.status(200).json(getSecureUserInfo(verifiedUser))

})

const updateUserKeys = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {publicKey,privateKey}:keySchemaType = req.body

    const updatedUser = await User.findByIdAndUpdate(req.user?._id,{publicKey,privateKey},{new:true})
    await updatedUser?.save()

    return res.status(200).json({publicKey:updatedUser?.publicKey})

})

const updateFcmToken = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {fcmToken}:fcmTokenSchemaType = req.body
    const user = await User.findByIdAndUpdate(req.user?._id,{fcmToken},{new:true})
    return res.status(200).json({fcmTokenExists:user?.fcmToken?.length?true:false})
})

const verifyPassword = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {password}:verifyPasswordSchemaType = req.body

    if(req.user?.password && (await bcrypt.compare(password,req.user.password))){

        const {verificationUrl} = await generatePrivateKeyRecoveryToken(req.user._id.toString())

        await sendMail(req.user.email,req.user.username,'privateKeyRecovery',undefined,undefined,verificationUrl)

        return res.status(200).json({message:"We have sent you an email with verification link, please check spam if not received"})
    }

    return next(new CustomError("Password is incorrect",400))
})

const verifyPrivateKeyToken = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {recoveryToken}:verifyPrivateKeyTokenSchemaType = req.body
    
    const isExistingToken = await PrivateKeyRecoveryToken.findOne({user:req.user?._id})

    if(!isExistingToken){
        return next(new CustomError('Token does not exists',404))
    }

    if(isExistingToken.expiresAt < new Date){
        await isExistingToken.deleteOne()
        return next(new CustomError('Verification link has been expired',400))
    }

    if(!(await bcrypt.compare(recoveryToken,isExistingToken.hashedToken))){
        return next(new CustomError('Verification link is not valid',400))
    }

    const decodedData = jwt.verify(recoveryToken,env.JWT_SECRET) as {user:string}

    if(decodedData.user !== req.user?._id.toString()){
        await isExistingToken.deleteOne()
        return next(new CustomError('Verification link is not valid',400))
    }

    const payload:{privateKey:string,combinedSecret?:string} = {
        privateKey:req.user.privateKey
    }

    if(req.user.oAuthSignup){
        payload['combinedSecret'] = req.user.googleId+env.PRIVATE_KEY_RECOVERY_SECRET
    }

    return res.status(200).json(payload)

})

const sendPrivateKeyRecoveryEmail = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(req.user){

        const {verificationUrl} = await generatePrivateKeyRecoveryToken(req.user._id.toString())
    
        await sendMail(req.user.email,req.user.username,'privateKeyRecovery',undefined,undefined,verificationUrl)
        return res.status(200).json({message:"We have sent you an email with verification link, please check spam if not received"})
    }
})

const sendOAuthCookie = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {tempToken}:setAuthCookieSchemaType = req.body
    const decoded = jwt.verify(tempToken,env.JWT_SECRET) as {user:string,oAuthNewUser:boolean}
    
    const user = await User.findById(decoded.user)

    if(!user){
        return next(new CustomError("User not found",400))
    }
    
    const secureInfo = getSecureUserInfo(user)

    sendToken(res,user._id,200,secureInfo,true,decoded.oAuthNewUser,user.googleId)

})

const checkAuth = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    if(req.user){
        return res.status(200).json(getSecureUserInfo(req.user))
    }
    return next(new CustomError("Token missing, please login again",401))
})

const redirectHandler = asyncErrorHandler(async(req:OAuthAuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(req.user){
        const tempToken =  jwt.sign({user:req.user._id.toString(),oAuthNewUser:req.user.newUser},env.JWT_SECRET,{expiresIn:"5m"})
        return res.redirect(307,`${config.clientUrl}/auth/temp-token/${tempToken}`)
    }
    else{
        return res.redirect(`${config.clientUrl}/auth/login`)
    }
})

const logout = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("token",{...cookieOptions,maxAge:0}).status(200).json({message:"Logout successful"})
})


export {
    checkAuth,
    forgotPassword,
    login,
    logout,
    redirectHandler,
    resetPassword, sendOAuthCookie, sendOtp, sendPrivateKeyRecoveryEmail, signup, updateFcmToken, updateUserKeys,
    verifyOtp,
    verifyPassword,
    verifyPrivateKeyToken
};

