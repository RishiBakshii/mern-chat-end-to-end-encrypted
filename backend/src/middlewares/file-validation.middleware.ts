import { NextFunction, Request, Response } from "express";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../constants/file.constant.js";
import { CustomError } from "../utils/error.utils.js";

export const fileValidation = (req:Request,res:Response,next:NextFunction)=>{

    if(req.file){
        
        if(!ACCEPTED_IMAGE_TYPES.includes(req.file.mimetype)){
            return next(new CustomError(`Only ${ACCEPTED_IMAGE_TYPES.join(" ")} file types are supported and you are trying to upload a file with ${req.file.mimetype} type`,400))
        }
        
        if(req.file.size > MAX_FILE_SIZE){
            return next(new CustomError(`Avatar must not be larger than ${MAX_FILE_SIZE/1000000.}MB`,400))
        }

        return next()
    }

    return next()

}