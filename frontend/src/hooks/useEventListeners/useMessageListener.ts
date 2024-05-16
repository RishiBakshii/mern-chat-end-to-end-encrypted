import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { Events } from "../../enums/events"
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice"
import type { IMessage } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageListener = () => {    

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
