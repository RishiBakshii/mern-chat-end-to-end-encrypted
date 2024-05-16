import { Events } from "../../enums/events"
import { IChatMember, IUserTypingEventReceiveData } from "../../interfaces/chat"
import { chatApi, useGetChatsQuery } from "../../services/api/chatApi"
import { removeUserTyping, selectSelectedChatDetails, updateUserTyping } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useTypingListener = () => {

    const dispatch = useAppDispatch()
    const {data:chats} = useGetChatsQuery()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const setTypingTimeout = (user:IChatMember,chatId:string) => {

      setTimeout(() => {

        dispatch(
          chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
            const chat  = draft.find(chat=>chat._id===chatId)

            if(chat){
              chat.userTyping = chat.userTyping.filter(u=>u._id!==user._id)
            }
          })
        )

        dispatch(removeUserTyping(user))

      }, 1500);
    }

    useSocketEvent(Events.USER_TYPING,({chatId,user}:IUserTypingEventReceiveData)=>{

        const isTypinginOpennedChat = chatId===selectedChatDetails?._id

        if(isTypinginOpennedChat){

            if(!selectedChatDetails?.userTyping.some(({_id})=>_id===user._id)){
              dispatch(updateUserTyping(user))
            }
        }

        else{
          
          const chat = chats?.find(chat=>chat._id===chatId)

          if(chat){
            dispatch(
              chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const chat = draft.find(chat=>chat._id===chatId)
    
                if(chat){
                  chat.userTyping.push(user)
                }
              })
            )
          }
        }

        setTypingTimeout(user,chatId)

      })
}
