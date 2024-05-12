import { useAppDispatch, useAppSelector } from "../services/redux/store/hooks"
import { Events } from "../enums/events"
import { selectSelectedChatId } from "../services/redux/slices/chatSlice"
import { IUserTypingEventReceiveData } from "../interfaces/chat"
import { chatApi, useGetChatsQuery } from "../services/api/chatApi"
import { useDebounce } from "./useDebounce"
import { useSocketEvent } from "./useSocketEvent"

export const useTyping = () => {

    const [isTyping,setIsTyping] = useDebounce(false,2000)
    console.log(isTyping,'hook re-rendered');
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
