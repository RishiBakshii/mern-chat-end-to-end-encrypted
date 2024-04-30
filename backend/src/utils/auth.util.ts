import { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUser } from '../interfaces/user.interface.js'
import { env } from '../schemas/env.schema.js'
import {v2 as cloudinary} from 'cloudinary'
import { config } from '../config/env.config.js'

export const sendToken = (res:Response,payload:IUser['_id'],statusCode:number,data:IUser,OAuth:boolean=false)=>{

    const cookieOptions:CookieOptions = {
        maxAge:parseInt(env.JWT_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,
        httpOnly:true,
        secure:true,
        sameSite:env.NODE_ENV==='DEVELOPMENT'?"lax":"none"
    }

    const token=jwt.sign({_id:payload.toString()},env.JWT_SECRET,{expiresIn:`${env.JWT_TOKEN_EXPIRATION_DAYS}d`})
    
    if(OAuth){
        return res.cookie('token',token,cookieOptions).redirect(config.clientUrl)
    }

    return res.cookie("token",token,cookieOptions).status(statusCode).json(data)
    
}

export const generateOtp=():string=>{

    let OTP=""

    for(let i= 0 ; i<4 ; i++){
        OTP+=Math.floor(Math.random()*10)
    }

    return OTP

}

export const getBase64 = (file:Express.Multer.File) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const uploadFilesToCloudinary = async(files:Array<Express.Multer.File>)=>{
    const uploadPromises = files.map(file=>cloudinary.uploader.upload(getBase64(file)))
    const result = await Promise.all(uploadPromises)
    return result
}