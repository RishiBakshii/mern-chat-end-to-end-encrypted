import { useEffect } from "react"
import { useGetMessages } from "./useGetMessages"
import { useAppSelector } from "../../services/redux/store/hooks"
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice"

export const useFetchMessages = () => {

    const selectedChatId = useAppSelector(selectSelectedChatId)
    const {getMessages,data,isFetching,isLoading} = useGetMessages()

    useEffect(()=>{

        if(selectedChatId) {
            getMessages({_id:selectedChatId,page:1},true)
        }
        
    },[selectedChatId])

    return {
        isMessagesFetching:isFetching,
        isMessagesLoading:isLoading,
        messages:data?.messages,
        fetchMoreMessages:getMessages,
        totalMessagePages:data?.totalPages
    }
}
