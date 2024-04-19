import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.utils.js";
import { ZodError } from "zod";
import jwt from 'jsonwebtoken'

export const errorMiddleware = (err:CustomError | ZodError | Error | jwt.TokenExpiredError | jwt.JsonWebTokenError ,req:Request,res:Response,next:NextFunction) => {

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

        if (err instanceof jwt.TokenExpiredError) {
            statusCode=401
            message="Token expired, please login again"
        } 
        if (err instanceof jwt.JsonWebTokenError) {
            statusCode=401
            message="Invalid Token, please login again"
        } 
    }

    else {
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
    return res.status(statusCode).json({message})
}