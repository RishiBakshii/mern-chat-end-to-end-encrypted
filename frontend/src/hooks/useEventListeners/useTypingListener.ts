import { Events } from "../../enums/events"
import { IUserTypingEventReceiveData } from "../../interfaces/chat"
import { chatApi } from "../../services/api/chatApi"
import { removeUserTyping, selectSelectedChatDetails, updateUserTyping } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"


export const useTypingListener = () => {

    const dispatch = useAppDispatch()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useSocketEvent(Events.USER_TYPING,({chatId,user}:IUserTypingEventReceiveData)=>{

        const isTypinginOpennedChat = chatId===selectedChatDetails?._id

        if(isTypinginOpennedChat){

            const existInTypingArray = selectedChatDetails?.userTyping.some(({_id})=>_id===user._id)

            if(!existInTypingArray){

              dispatch(updateUserTyping(user))

              setTimeout(() => {
                  dispatch(removeUserTyping(user))
              }, 1500);
            }
        }

        else{
          
            let userExistsInTypingArray:boolean = false

            dispatch(
              chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const chat = draft.find(chat=>chat._id===chatId)
    
                if(chat){

                  if(!chat.userTyping.some(u=>u._id===user._id)){
                    chat.userTyping.push(user)
                    userExistsInTypingArray = true
                  }
                }
              })
            )
            
            if(userExistsInTypingArray){

              setTimeout(() => {
                dispatch(
                  chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                    const chat = draft.find(chat=>chat._id===chatId)
        
                    if(chat){ 
                      chat.userTyping =  chat.userTyping.filter(u=>u._id!==user._id)
                    }
                  })
                )
              }, 1500);
            }

          
        }

      })
}
