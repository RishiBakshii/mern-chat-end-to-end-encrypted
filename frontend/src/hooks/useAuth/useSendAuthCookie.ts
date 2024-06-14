import { useSendAuthCookieMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"

export const useSendAuthCookie = () => {

    const [sendAuthCookie,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useSendAuthCookieMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"",successToast:true})

    return {
        sendAuthCookie,
        isSuccess,
        data,
    }
}
