import { useEffect } from "react"
import { useResetPasswordMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export const useResetPassword = () => {

    const navigate = useNavigate()

    const [resetPassword,{error,isError,isLoading,isSuccess,isUninitialized}] = useResetPasswordMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Your password has been reset",successToast:true})

    useEffect(()=>{

        if(isSuccess){

            setTimeout(() => {
                toast.success("You will be redirected to login in 3 seconds")
            }, 1000);
    
            setTimeout(() => {
                navigate("/auth/login")
            }, 3000);

        }

        if(isError){
            navigate("/auth/login")
        }

    },[isSuccess,isError])

    return {
        resetPassword,
        isLoading,
    }
}
