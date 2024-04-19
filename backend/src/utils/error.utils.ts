import {Request,Response,NextFunction} from 'express'

export class CustomError extends Error {
    constructor(message:string='Interval Server Error', public statusCode:number=500){
        super(message)
    }
}

export const asyncErrorHandler = (func:(req:Request,res:Response,next:NextFunction)=>Promise<void>) => async(req:Request,res:Response,next:NextFunction)=>{
    try {
        await func(req,res,next)
    } catch (error) {
        next(error)
    }
}