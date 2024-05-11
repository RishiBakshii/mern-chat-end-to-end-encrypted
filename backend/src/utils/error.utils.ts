import {Request,Response,NextFunction} from 'express'
import type { AuthenticatedRequest } from '../interfaces/auth/auth.interface.js'

export class CustomError extends Error {
    constructor(message:string='Interval Server Error', public statusCode:number=500){
        super(message)
    }
}

export const asyncErrorHandler = (func:(req:Request | AuthenticatedRequest | any ,res:Response,next:NextFunction)=>Promise<void | Response>) => async(req:Request,res:Response,next:NextFunction)=>{
    try {
        await func(req,res,next)
    } catch (error) {
        next(error)
    }
}