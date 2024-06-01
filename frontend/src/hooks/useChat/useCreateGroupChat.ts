import { useCreateChatMutation } from "../../services/api/chatApi"
import { useToast } from "../useUI/useToast"

export const useCreateGroupChat = () => {

    const [createChat, {isLoading,isError,isSuccess,error,isUninitialized}] = useCreateChatMutation()
    useToast({isLoading,isUninitialized,isSuccess,isError,error,loaderToast:true,successToast:true,successMessage:"Group chat created"})

    return {
        createChat,
        isSuccess
    }
}
