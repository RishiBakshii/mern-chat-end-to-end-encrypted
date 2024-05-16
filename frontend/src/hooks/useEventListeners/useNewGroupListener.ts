import { useAppDispatch } from "../../services/redux/store/hooks"
import { Events } from "../../enums/events"
import type { IChatWithUnreadMessages } from "../../interfaces/chat"
import { chatApi } from "../../services/api/chatApi"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useNewGroupListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.NEW_GROUP,(newChat:IChatWithUnreadMessages)=>{
        dispatch(
          chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
            draft.push(newChat)
          })
        )
      })
}
