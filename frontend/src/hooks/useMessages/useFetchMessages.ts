import { useEffect } from "react"
import { useLazyGetMessagesByChatIdQuery } from "../../services/api/messageApi"
import { useToast } from "../useUI/useToast"

export const useFetchMessages = (chatId:string | undefined) => {

    const [getMessages,{error,isError,isFetching,isSuccess,isUninitialized,data}] =  useLazyGetMessagesByChatIdQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

    useEffect(()=>{

        if(chatId) getMessages(chatId,true)

    },[chatId])

    return {isMessagesFetching:isFetching,messages:data}
}
