import { useEffect } from "react"
import { useUpdateFcmTokenMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { updateLoggedInUserFcmTokenStatus } from "../../services/redux/slices/authSlice"

export const useUpdateFcmToken = () => {

    const dispatch = useAppDispatch()

    const [updateFcmToken,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useUpdateFcmTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"Great! now you will receive notifications from baatchit",successToast:true})

    useEffect(()=>{
        if(isSuccess && data) dispatch(updateLoggedInUserFcmTokenStatus(data.fcmTokenExists))
    },[isSuccess,data])

    return {
        updateFcmToken,
        isSuccess
    }
}
