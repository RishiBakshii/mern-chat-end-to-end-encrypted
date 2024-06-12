import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";
import { deleteFilesFromCloudinary, getSecureUserInfo, uploadFilesToCloudinary } from "../utils/auth.util.js";
import type { IUser } from "../interfaces/auth/auth.interface.js";
import { notificationsSchemaType } from "../schemas/user.schema.js";
import { sendMail } from "../utils/email.util.js";

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

const updateNotifications = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {isEnabled}:notificationsSchemaType = req.body

    const user = await User.findByIdAndUpdate(req.user?._id,{notificationsEnabled:isEnabled},{new:true})

    return res.status(200).json({notificationsEnabled:user?.notificationsEnabled})

})

const testEmailHandler = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {emailType} = req.query

    if(emailType === 'welcome'){
        await sendMail(req.user?.email!,req.user?.username!,'welcome',undefined,undefined,undefined)
        return res.status(200).json({message:`sent ${emailType}`})
    }

    if(emailType==='resetPassword'){
        await sendMail(req.user?.email!,req.user?.username!,'resetPassword','https://baatchit.online',undefined,undefined)
        return res.status(200).json({message:`sent ${emailType}`})
    }

    if(emailType==='otpVerification'){
        await sendMail(req.user?.email!,req.user?.username!,'OTP',undefined,"3412",undefined)
        return res.status(200).json({message:`sent ${emailType}`})
    }
    if(emailType==='privateKeyRecovery'){
        await sendMail(req.user?.email!,req.user?.username!,'privateKeyRecovery',undefined,undefined,'https://baatchit.online')
        return res.status(200).json({message:`sent ${emailType}`})
    }

    res.status(200).json({})
})

export { getUserDetails ,getUserByUsername, udpateUser, updateNotifications , testEmailHandler};
