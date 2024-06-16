import { useLazyGetMessagesByChatIdQuery } from "../../services/api/messageApi"
import { useToast } from "../useUI/useToast"

export const useGetMessages = () => {

    
    const [getMessages,{error,isError,isFetching,isSuccess,isUninitialized,data,isLoading}] =  useLazyGetMessagesByChatIdQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

    return {
        getMessages,
        data,
        isFetching,
        isLoading,
    }
}
