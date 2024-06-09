import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import type { IMessageSeenEventPayloadData, IUnreadMessageEventReceiveData } from "../../interfaces/messages"
import { chatApi } from "../../services/api/chatApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { selectJoinedChats } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { printDraft } from "../../utils/helpers"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useUnreadMessageListener = () => {

    const socket = getSocket()
    const dispatch = useAppDispatch()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    
    const joinedChats = useAppSelector(selectJoinedChats)
    
    useSocketEvent(Events.UNREAD_MESSAGE,({chatId,message}:IUnreadMessageEventReceiveData)=>{

        console.log({chatId,message});

        if(chatId === selectedChatDetails?._id){
    
          const payload:IMessageSeenEventPayloadData = {
            chatId:selectedChatDetails._id,
          }
          socket?.emit(Events.MESSAGE_SEEN,payload)

        }

        else{
          console.log('a message came in else condition');
          dispatch(
            chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
      
              const chat = draft.find(draft=>draft._id===chatId)

              if(chat){
                printDraft(chat)
                chat.unreadMessages.message.url=false
                chat.unreadMessages.message.attachments = false
                chat.unreadMessages.message.poll = false

                chat.unreadMessages.count++
                
                if(message.poll){
                  chat.unreadMessages.message.poll=true
                }

                if(message.content?.length){
                  console.log('condition hit');
                  chat.unreadMessages.message.content = message.content
                }
                else if(message.attachments){
                  chat.unreadMessages.message.attachments = true
                }
                else if(message.url){
                  chat.unreadMessages.message.url=true
                }
              }
              
            })
          )
        }
    
      },joinedChats)
}
