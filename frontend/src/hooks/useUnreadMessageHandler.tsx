import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getSocket } from "../context/socket"
import { Events } from "../enums/events"
import { chatApi, useGetChatsQuery } from "../features/chat/api"
import { selectSelectedChatId } from "../features/chat/chatSlice"
import type { IMessageSeenEventPayloadData, IUnreadMessageEventReceiveData } from "../interfaces/messages"
import { useSocketEvent } from "./useSocketEvent"

export const useUnreadMessageHandler = () => {

    const socket = getSocket()
    const dispatch = useAppDispatch()

    const selectedChatId = useAppSelector(selectSelectedChatId)
    const {data:chats} = useGetChatsQuery()

    useSocketEvent(Events.UNREAD_MESSAGE,(data:IUnreadMessageEventReceiveData)=>{

        if(data.chatId === selectedChatId){
    
          const payload:IMessageSeenEventPayloadData =  {
            chatId:selectedChatId,
            members:chats?.find(chat=>chat._id===selectedChatId)?.members.map(member=>member._id)!
          }
    
          socket?.emit(Events.MESSAGE_SEEN,payload)
        }
        else{
          dispatch(
            chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
      
              const chat = draft.find(draft=>draft._id===data.chatId)
      
              if(chat){
                chat.unreadMessages.count++
                chat.unreadMessages.message = data.message
                chat.unreadMessages.sender = data.sender
              }
              
            })
          )
        }
    
      })
}
