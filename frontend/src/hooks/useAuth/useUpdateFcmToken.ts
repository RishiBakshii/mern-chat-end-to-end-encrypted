import { useUpdateFcmTokenMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"

export const useUpdateFcmToken = () => {

    const [updateFcmToken,{error,isError,isLoading,isSuccess,isUninitialized}] = useUpdateFcmTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"Great! now you will receive notifications from baatchit",successToast:true})

    return {
        updateFcmToken
    }
}
