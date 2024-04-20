import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUser } from '../interfaces/user.interface.js'
import { env } from '../schemas/env.schema.js'


export const sendToken = (res:Response,payload:IUser['_id'],statusCode:number,data:IUser)=>{

    const token=jwt.sign({_id:payload.toString()},env.JWT_SECRET,{expiresIn:`${env.JWT_TOKEN_EXPIRATION_DAYS}d`})
    return res.cookie("token",token,{
        maxAge:parseInt(env.JWT_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,
        httpOnly:true,
        secure:true,
        sameSite:env.NODE_ENV==='DEVELOPMENT'?"lax":"none"
    }).status(statusCode).json(data)
    
}