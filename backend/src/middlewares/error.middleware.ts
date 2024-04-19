import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.utils.js";

export const errorMiddleware = (err:CustomError,req:Request,res:Response,next:NextFunction) => {
    return res.status(err.statusCode).json({message:err.message})
}