import { useGetChatsQuery } from "../../services/api/chatApi"
import { useToast } from "../useUI/useToast"

export const useFetchChats = () => {

    const {isError,isFetching,isSuccess,isUninitialized,error,data} = useGetChatsQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})


    return {isChatsFetching:isFetching,chats:data}
}
