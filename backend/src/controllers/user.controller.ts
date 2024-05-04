import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";
import { deleteFileFromCloudinary, getSecureUserInfo, uploadFilesToCloudinary } from "../utils/auth.util.js";
import { IUser } from "../interfaces/user.interface.js";

const getUserDetails = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    return res.status(200).json(req.user)
})

const getUserByUsername = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const {username} = req.query

    if(!username || !username?.toString().trim()){
        return next(new CustomError("Username cannot be empty"))
    }

    const searchTerm = new RegExp(`${username.toString().toLowerCase()}`,'i')

    const results = await User.find({username:searchTerm},{avatar:1,username:1,name:1},{fuzzy:true})

    return res.status(200).json(results)
    
})

const udpateUser  = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    
    if(req.file){ 
        let uploadResults
        const existingPublicId = req.user?.avatar?.publicId

        if(!existingPublicId){
            uploadResults = await uploadFilesToCloudinary([req.file])
        }
        else if(existingPublicId){

            await deleteFileFromCloudinary(existingPublicId)
            uploadResults = await uploadFilesToCloudinary([req.file])

        }

        if(uploadResults){

            const updatedUser = await User.findByIdAndUpdate(req.user?._id,{
                avatar:{
                    secureUrl:uploadResults[0].secure_url,
                    publicId:uploadResults[0].public_id
                }
            },{new:true}) as IUser

            return res.status(200).json(getSecureUserInfo(updatedUser))
        }

        return next(new CustomError("Some error occured",500))
        
    }
})


export { getUserDetails ,getUserByUsername, udpateUser };
