import { useUpdateChatMutation } from "../../services/api/chatApi"
import { useToast } from "../useUI/useToast"

export const useUpdateChat = () => {

    const [updateChat,{error,isError,isLoading,isSuccess,isUninitialized}] = useUpdateChatMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Chat details updated",successToast:true})

    return {
        updateChat,
    }
}
