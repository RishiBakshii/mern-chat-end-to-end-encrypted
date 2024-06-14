import { useEffect } from "react"
import { useLazyGetMessagesByChatIdQuery } from "../../services/api/messageApi"
import { useToast } from "../useUI/useToast"

export const useFetchMessages = (chatId:string | undefined,page:number) => {

    const [getMessages,{error,isError,isFetching,isSuccess,isUninitialized,data,isLoading}] =  useLazyGetMessagesByChatIdQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

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
