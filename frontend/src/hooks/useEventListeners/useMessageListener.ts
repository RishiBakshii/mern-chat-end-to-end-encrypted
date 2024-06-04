import { Events } from "../../enums/events"
import type { IMessage } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { selectJoinedChats, updateJoinedChatMessage } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageListener = () => {    

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const joinedChats = useAppSelector(selectJoinedChats)
    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE,async(newMessage:IMessage)=>{

        if(joinedChats.length>0){
          const isMessageForJoinedChat = joinedChats.find(joinedChat=>joinedChat.chatId===newMessage.chat)

          if(isMessageForJoinedChat){
            dispatch(updateJoinedChatMessage({joinedChatId:isMessageForJoinedChat.chatId,newMessage:newMessage}))
          }

          return
        }

        if(selectedChatDetails){

          dispatch(
            messageApi.util.updateQueryData('getMessagesByChatId',{_id:selectedChatDetails._id,page:1},(draft)=>{
              draft.messages.push(newMessage)
            })
          )
        }
        
      },joinedChats)
}
