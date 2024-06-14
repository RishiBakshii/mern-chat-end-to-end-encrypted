import { useLazySendPrivateKeyRecoveryEmailQuery } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"

export const useSendPrivateKeyRecoveryEmail = () => {

    const [sendPrivateKeyRecoveryEmail,{error,isError,isLoading,isSuccess,isUninitialized}] = useLazySendPrivateKeyRecoveryEmailQuery()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"We have sent you an email with verification link, please check spam if not received",successToast:true})

    return {
        sendPrivateKeyRecoveryEmail,
        isSuccess,
        isLoading
    }
}
