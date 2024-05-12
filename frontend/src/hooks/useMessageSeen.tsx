import { useAppDispatch, useAppSelector } from "../services/redux/store/hooks"
import { Events } from "../enums/events"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import type { IMessageSeenEventReceiveData } from "../interfaces/messages"
import { chatApi } from "../services/api/chatApi"
import { useSocketEvent } from "./useSocketEvent"

export const useMessageSeen = () => {


    const dispatch = useAppDispatch()
    
    const loggedInUser = useAppSelector(selectLoggedInUser)

    useSocketEvent(Events.MESSAGE_SEEN,(seenMessageDetails:IMessageSeenEventReceiveData)=>{
        if(seenMessageDetails.user._id === loggedInUser?._id){
          dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
              const chat = draft.find(chat=>chat._id===seenMessageDetails.chat)
      
              if(chat){
                chat.unreadMessages.count=0
              }
            })
          )
        }
        else{
          dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
              const chat = draft.find(chat=>chat._id===seenMessageDetails.chat)
      
              if(chat){
                console.log('pushed brotherrrrr');
                chat.seenBy?.push(seenMessageDetails.user)
              }
            })
          )
        }
      })
}