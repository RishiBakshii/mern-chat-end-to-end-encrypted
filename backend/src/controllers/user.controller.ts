import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";
import { deleteFilesFromCloudinary, getSecureUserInfo, uploadFilesToCloudinary } from "../utils/auth.util.js";
import type { IUser } from "../interfaces/auth/auth.interface.js";

const getUserDetails = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    return res.status(200).json(req.user)
})

const getUserByUsername = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {username} = req.query

    if(!username || !username?.toString().trim()){
        return next(new CustomError("Username cannot be empty"))
    }

    const regexUsername = new RegExp(username.toString().trim(), "i")

    const transformedResults = await User.aggregate([
        {
            $match:{
                username:{
                    $regex:regexUsername
                }
            }
        },
        {
            $addFields:{
                avatar:"$avatar.secureUrl"
            }
        },
        {
            $project:{
                name:1,
                username:1,
                avatar:1
            }
        }
    ])

    return res.status(200).json(transformedResults)
    
})

const udpateUser  = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    
    if(req.file){ 
        let uploadResults
        const existingPublicId = req.user?.avatar?.publicId

        if(!existingPublicId){
            uploadResults = await uploadFilesToCloudinary([req.file])
        }
        else if(existingPublicId){

            const avatarPromise = [
                deleteFilesFromCloudinary([existingPublicId]),
                uploadFilesToCloudinary([req.file])
            ]

            const [_,result] = await Promise.all(avatarPromise)
            uploadResults = result
            
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
