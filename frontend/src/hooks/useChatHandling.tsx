import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectSelectedChatId, updateSelectedChatDetails } from "../features/chat/chatSlice"
import { useLazyGetMessagesByChatIdQuery } from "../features/messages/api"
import { useGetChatsQuery } from "../features/chat/api"
import { IMessage } from "../interfaces/messages"

export const useChatHandling = () : [boolean,Array<IMessage> | undefined] => {

    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const {data:chats} = useGetChatsQuery()

    const [getMessagesByChatId,{isFetching:isMessagesFetching,data:messages}] = useLazyGetMessagesByChatIdQuery()

    useEffect(()=>{

        if(selectedChatId){

            const chat = chats?.find(chat=>chat._id===selectedChatId)
            
            if(chat){
                dispatch(updateSelectedChatDetails(chat))
                getMessagesByChatId(selectedChatId,true)
            }
    
         }
    },[selectedChatId,dispatch])

    return [
        isMessagesFetching,
        messages
    ]
}
