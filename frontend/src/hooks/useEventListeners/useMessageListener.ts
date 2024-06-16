import { Events } from "../../enums/events"
import type { IMessage } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageListener = () => {    

  
    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE,async(newMessage:IMessage)=>{

          dispatch(
            messageApi.util.updateQueryData('getMessagesByChatId',{_id:newMessage.chat,page:1},(draft)=>{
              draft.messages.push(newMessage)
              if(!draft.totalPages){
                draft.totalPages =1
              }
            })
          )

      })
}
