import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.utils.js";
import { ZodError } from "zod";

export const errorMiddleware = (err:CustomError | ZodError | Error,req:Request,res:Response,next:NextFunction) => {

    let message;
    let statusCode=500;

    if(err instanceof ZodError){
        console.log('zod error');
        message=(err.issues.map(issue=>issue.message)).join(", ")
        console.log(message);
        statusCode=400
    }

    else if(err instanceof CustomError){
        message = err.message
        statusCode = err.statusCode
    }

    else if(err instanceof Error){
        message = err.message
        statusCode = 500
    }
    
    return res.status(statusCode).json({message})
}