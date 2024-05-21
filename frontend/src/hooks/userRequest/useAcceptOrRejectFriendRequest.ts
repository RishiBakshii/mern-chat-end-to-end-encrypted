import { useHandleFriendRequestMutation } from "../../services/api/requestApi"
import { useToast } from "../useUI/useToast"

export const useAcceptOrRejectFriendRequest = () => {

    const [handleFriendRequest,{error,isError,isLoading,isSuccess,isUninitialized,}] = useHandleFriendRequestMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized})

    return {
        handleFriendRequest,
        isLoading
    }
}
