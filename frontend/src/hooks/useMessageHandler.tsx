import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Events } from "../enums/events"
import { selectSelectedChatId } from "../features/chat/chatSlice"
import { messageApi } from "../features/messages/api"
import type { IMessage } from "../interfaces/messages"
import { useSocketEvent } from "./useSocketEvent"

export const useMessageHandler = () => {    

    const selectedChatId = useAppSelector(selectSelectedChatId)
    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE,(newMessage:IMessage)=>{
        if(selectedChatId){
          dispatch(
            messageApi.util.updateQueryData('getMessagesByChatId',selectedChatId,(draft)=>{
              draft.push(newMessage)
            })
          )
        }
      })
}
