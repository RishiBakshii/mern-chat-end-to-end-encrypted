import { Events } from "../../enums/events"
import type { IMessage } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageListener = () => {    

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE,async(newMessage:IMessage)=>{
      
        if(selectedChatDetails){

          dispatch(
            messageApi.util.updateQueryData('getMessagesByChatId',{_id:selectedChatDetails._id,page:1},(draft)=>{
              draft.messages.push(newMessage)
              if(!draft.totalPages){
                draft.totalPages =1
              }
            })
          )
        }
        
      })
}
