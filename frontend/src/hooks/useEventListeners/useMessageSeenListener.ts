import { Events } from "../../enums/events"
import type { IMessageSeenEventReceiveData } from "../../interfaces/messages"
import { chatApi } from "../../services/api/chatApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { updateSeenByList } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageSeenListener = () => {

    const dispatch = useAppDispatch()
    
    const loggedInUser = useAppSelector(selectLoggedInUser)

    useSocketEvent(Events.MESSAGE_SEEN,(data:IMessageSeenEventReceiveData)=>{

        const isOwnMessageSeenUpdate = data.user._id === loggedInUser?._id

        dispatch(
          chatApi.util.updateQueryData("getChats",undefined,(draft)=>{

            const chat = draft.find(chat=>chat._id===data.chat)

            if(chat){

              if(isOwnMessageSeenUpdate){
                  chat.unreadMessages.count=0
              }
              else{
                dispatch(updateSeenByList(data.user))
                chat.seenBy.push(data.user)
              }
            }
            
          })
        )

      })
}
