import { useEffect } from "react"
import { selectSelectedChatId, updateSelectedChatDetails } from "../services/redux/slices/chatSlice"
import { IMessage } from "../interfaces/messages"
import { useGetChatsQuery } from "../services/api/chatApi"
import { useLazyGetMessagesByChatIdQuery } from "../services/api/messageApi"
import { useAppDispatch, useAppSelector } from "../services/redux/store/hooks"

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
