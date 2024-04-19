import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.utils.js";
import { ZodError } from "zod";

export const errorMiddleware = (err:CustomError,req:Request,res:Response,next:NextFunction) => {

    if(err instanceof ZodError){
        return res.status(400).json(err.flatten().fieldErrors)
    }

    
    return res.status(err.statusCode).json({message:err.message})
}