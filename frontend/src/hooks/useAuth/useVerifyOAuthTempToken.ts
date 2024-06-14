import { useEffect } from "react"
import { useVerifyOAuthTempTokenMutation } from "../../services/api/authApi"
import { updateLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useToast } from "../useUI/useToast"
import { useGenerateKeyPair } from "./useGenerateKeyPair"

export const useVerifyOAuthTempToken = () => {
    
    const dispatch = useAppDispatch()

    const [verifyTempToken,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyOAuthTempTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Welcome to baatchit, we are happy to have you on-board",successToast:true})

    const updateLoggedInUserCallBack = ()=>{
        if(data?.user){
            dispatch(updateLoggedInUser(data.user))
        }
    }

    useEffect(()=>{
        if(data && isSuccess && !data.combinedSecret){
            updateLoggedInUserCallBack()
        }
    },[data,isSuccess])

    useGenerateKeyPair(data?.combinedSecret?true:false,data?.user._id,data?.combinedSecret,updateLoggedInUserCallBack)



    return {
        verifyTempToken
    }
}
