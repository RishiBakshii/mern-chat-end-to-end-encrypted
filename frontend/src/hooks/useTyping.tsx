import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Events } from "../enums/events"
import { chatApi, useGetChatsQuery } from "../features/chat/api"
import { selectSelectedChatId } from "../features/chat/chatSlice"
import { IUserTypingEventReceiveData } from "../interfaces/chat"
import { useDebounce } from "./useDebounce"
import { useSocketEvent } from "./useSocketEvent"

export const useTyping = () => {

    const [isTyping,setIsTyping] = useDebounce(false,2000)

    const dispatch = useAppDispatch()
    const {data:chats} = useGetChatsQuery()
    
    const selectedChatId = useAppSelector(selectSelectedChatId)

    useSocketEvent(Events.USER_TYPING,({chatId,user}:IUserTypingEventReceiveData)=>{

        if(chatId===selectedChatId){
          setIsTyping(true)
        }
        else{
          const chat = chats?.find(chat=>chat._id===chatId)

          if(chat){
            dispatch(
              chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const chat = draft.find(chat=>chat._id===chatId)
    
                if(chat){
                  chat.userTyping=user
                }
              })
            )
          }
        }
      })

      return isTyping
}
