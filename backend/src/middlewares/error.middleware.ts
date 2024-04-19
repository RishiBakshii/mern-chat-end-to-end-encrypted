import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.utils.js";
import { ZodError } from "zod";

export const errorMiddleware = (err:CustomError | ZodError | Error,req:Request,res:Response,next:NextFunction) => {

    let message;
    let statusCode=500;

    if(err instanceof ZodError){
        message=err.flatten().fieldErrors
        statusCode=400
    }

    if(err instanceof CustomError){
        message = err.message
        statusCode = err.statusCode
    }

    if(err instanceof Error){
        message = err.message
        statusCode = 500
    }
    
    return res.status(statusCode).json({message})
}