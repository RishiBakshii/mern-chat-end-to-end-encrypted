import { ZodObject } from "zod";
import {Request,Response,NextFunction} from 'express'

export const validate = (schema:ZodObject<any>) => (req:Request,res:Response,next:NextFunction)=>{

    try {
        req.body=schema.parse(req.body)
        next()
    } catch (error) {
        next(error)
    }

}