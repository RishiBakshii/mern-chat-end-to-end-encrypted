import { Events } from "../../enums/events"
import { chatApi } from "../../services/api/chatApi"
import { friendApi } from "../../services/api/friendApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useOfflineListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.OFFLINE,(userId:string)=>{

      dispatch(
        friendApi.util.updateQueryData('getFriends',undefined,(draft)=>{
          const friend = draft.find(draft=>draft._id===userId)

          if(friend){
            friend.isActive = false
          }
        })
      )

      dispatch(
        chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
          
          draft.map(draft=>{
           const user =  draft.members.find(member=>member._id===userId)
           if(user){
            user.isActive=false
           }
          })
        })
      )

    })
}
