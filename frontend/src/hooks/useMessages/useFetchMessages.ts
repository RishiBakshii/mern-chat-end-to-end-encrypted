import { useEffect } from "react"
import { useGetMessages } from "./useGetMessages"

export const useFetchMessages = (chatId:string | undefined,page:number) => {

    const {getMessages,data,isFetching,isLoading} = useGetMessages()

    useEffect(()=>{

        if(chatId) getMessages({_id:chatId,page},true)
        
    },[chatId])

    return {
        isMessagesFetching:isFetching,
        isMessagesLoading:isLoading,
        messages:data?.messages,
        fetchMoreMessages:getMessages,
        totalMessagePages:data?.totalPages
    }
}
