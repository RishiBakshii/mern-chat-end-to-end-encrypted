import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { Events } from "../../enums/events"
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice"
import type { IMessage } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { useSocketEvent } from "../useSocket/useSocketEvent"
import { selectJoinedChats, updateJoinedChatMessage } from "../../services/redux/slices/uiSlice"

export const useMessageListener = () => {    

    const selectedChatId = useAppSelector(selectSelectedChatId)
    const joinedChats = useAppSelector(selectJoinedChats)
    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE,(newMessage:IMessage)=>{

        if(joinedChats.length>0){
          const isMessageForJoinedChat = joinedChats.find(joinedChat=>joinedChat.chatId===newMessage.chat)

          if(isMessageForJoinedChat){
            dispatch(updateJoinedChatMessage({joinedChatId:isMessageForJoinedChat.chatId,newMessage:newMessage}))
          }

          return
        }
        if(selectedChatId && newMessage.chat===selectedChatId){
          dispatch(
            messageApi.util.updateQueryData('getMessagesByChatId',{_id:selectedChatId,page:1},(draft)=>{
              draft.messages.push(newMessage)
            })
          )
        }
      },joinedChats)
}
