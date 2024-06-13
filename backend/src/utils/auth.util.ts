import { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { ISecureInfo, IUser } from '../interfaces/auth/auth.interface.js'
import { env } from '../schemas/env.schema.js'
import {v2 as cloudinary} from 'cloudinary'
import { config } from '../config/env.config.js'
import bcrypt from 'bcryptjs'
import { PrivateKeyRecoveryToken } from '../models/private-key-recovery-token.model.js'

export const cookieOptions:CookieOptions = {
    maxAge:parseInt(env.JWT_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,
    httpOnly:true,
    path:"/",
    priority:"high",
    secure:true,
    sameSite:env.NODE_ENV==='DEVELOPMENT'?"lax":"none"
}

export const sendToken = (res:Response,payload:IUser['_id'],statusCode:number,data:ISecureInfo,OAuth:boolean=false,OAuthNewUser:boolean=false,googleId?:string)=>{


    const token=jwt.sign({_id:payload.toString()},env.JWT_SECRET,{expiresIn:`${env.JWT_TOKEN_EXPIRATION_DAYS}d`})
    
    if(OAuth){
        res.cookie('token',token,{...cookieOptions}).cookie("newUserViaOAuth20",OAuthNewUser?googleId+env.PRIVATE_KEY_RECOVERY_SECRET:"",{...cookieOptions,httpOnly:false})
        return res.redirect(config.clientUrl)
    }

    else{
        return res.cookie("token",token,cookieOptions).status(statusCode).json(data)
    }
 
}

export const generateOtp=():string=>{

    let OTP=""

    for(let i= 0 ; i<4 ; i++){
        OTP+=Math.floor(Math.random()*10)
    }

    return OTP

}

export const uploadFilesToCloudinary = async(files:Array<Express.Multer.File>)=>{
    const uploadPromises = files.map(file=>cloudinary.uploader.upload(file.path))
    const result = await Promise.all(uploadPromises)
    return result
}

export const deleteFilesFromCloudinary = async(publicIds:Array<string>)=>{
    const deletePromises = publicIds.map(publicId=>cloudinary.uploader.destroy(publicId))
    const uploadResult = await Promise.all(deletePromises)
    return uploadResult
}

export const generatePrivateKeyRecoveryToken = async(userId:string)=>{

    const token = jwt.sign({user:userId},env.JWT_SECRET)
    const hashedToken = await bcrypt.hash(token,10)

    const privateKeyPromise = [
        PrivateKeyRecoveryToken.deleteMany({user:userId}),
        PrivateKeyRecoveryToken.create({user:userId,hashedToken})
    ]

    await Promise.all(privateKeyPromise)

    const verificationUrl = `${config.clientUrl}/auth/privatekey-verification/${token}`

    return {verificationUrl}
}

export const getSecureUserInfo = (user:IUser):ISecureInfo=>{
    return {
        _id:user._id,
        name:user.name,
        username:user.username,
        avatar:user.avatar?.secureUrl,
        email:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        verified:user.verified,
        publicKey:user?.publicKey,
        notificationsEnabled:user.notificationsEnabled,
        verificationBadge:user.verificationBadge,
        fcmTokenExists:user.fcmToken?.length?true:false,
        oAuthSignup:user.oAuthSignup
    }
}