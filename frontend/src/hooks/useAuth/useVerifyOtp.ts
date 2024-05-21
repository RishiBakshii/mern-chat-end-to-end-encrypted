import { useVerifyOtpMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"
import { useHandleNavigate } from "../useUtils/useHandleNavigate"
import { useUpdateLogin } from "./useUpdateLogin"

export const useVerifyOtp = () => {

    const [verifyOtp,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyOtpMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Awesome!🎉 thankyou for verifying the otp",successToast:true})

    useUpdateLogin(isSuccess,data)

    useHandleNavigate("/",isSuccess)

    return {
        verifyOtp,
        isLoading
    }

}
