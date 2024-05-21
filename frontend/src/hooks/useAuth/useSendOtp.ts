import { useLazySendOtpQuery } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"

export const useSendOtp = () => {

    const [sendOtp,{error,isError,isFetching,isSuccess,isUninitialized}] = useLazySendOtpQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized,loaderToast:true,successMessage:"We have sent an OTP",successToast:true})

    return {
        sendOtp,
        isLoading:isFetching,
        isSuccess
    }
}
