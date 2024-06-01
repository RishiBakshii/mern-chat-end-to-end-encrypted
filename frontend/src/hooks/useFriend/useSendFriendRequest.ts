import { useSendFriendRequestMutation } from "../../services/api/requestApi"
import { useToast } from "../useUI/useToast"

export const useSendFriendRequest = () => {

    const [sendFriendRequest,{error,isError,isLoading,isSuccess,isUninitialized}] = useSendFriendRequestMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Friend reqeust sent",successToast:true})

    return {
        sendFriendRequest
    }
}
