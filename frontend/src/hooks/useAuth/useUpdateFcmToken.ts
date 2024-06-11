import { useEffect } from "react"
import { useUpdateFcmTokenMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"
import { LocalStorageKeys } from "../../enums/localStorage"

export const useUpdateFcmToken = () => {

    const [updateFcmToken,{error,isError,isLoading,isSuccess,isUninitialized}] = useUpdateFcmTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"Great! now you will receive notifications from baatchit",successToast:true})

    useEffect(()=>{
        if(isSuccess) localStorage.setItem(LocalStorageKeys.FCM_TOKEN_EXISTS,"true")
    },[isSuccess])

    return {
        updateFcmToken,
        isSuccess
    }
}
