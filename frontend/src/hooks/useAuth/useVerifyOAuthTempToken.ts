import { useEffect } from "react"
import { useVerifyOAuthTempTokenMutation } from "../../services/api/authApi"
import { updateLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useToast } from "../useUI/useToast"
import { useGenerateKeyPair } from "./useGenerateKeyPair"
import { IUser } from "../../interfaces/auth"

export const useVerifyOAuthTempToken = () => {
    
    const dispatch = useAppDispatch()

    const [verifyTempToken,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyOAuthTempTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Welcome to baatchit, we are happy to have you on-board",successToast:true})

    const updateLoggedInUserCallBack = (publicKey?:string)=>{
        if(data?.user){

            let loggedInUserData:IUser

            console.log('publicKey',publicKey);

            loggedInUserData = data.user

            if(publicKey) loggedInUserData = {...loggedInUserData,publicKey}


            dispatch(updateLoggedInUser(loggedInUserData))
        }
    }

    useEffect(()=>{
        if(!isLoading && data && isSuccess && !data.combinedSecret){
            console.log('existing user oauth login');
            updateLoggedInUserCallBack()
        }
    },[data,isSuccess,isLoading])

    useGenerateKeyPair(data?.combinedSecret?.length?true:false,data?.user._id,data?.combinedSecret,updateLoggedInUserCallBack)



    return {
        verifyTempToken
    }
}
