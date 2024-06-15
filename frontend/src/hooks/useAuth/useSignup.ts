import { useSignupMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"

export const useSignup = () => {

    const [signup,{data,isSuccess,isError,isLoading,isUninitialized,error}] = useSignupMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true})

    return {
        signup,
        isSuccess,
        isLoading,
        data
    }
}
