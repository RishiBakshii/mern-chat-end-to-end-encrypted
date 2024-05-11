import { useAppDispatch } from "../app/hooks"
import { Events } from "../enums/events"
import { chatApi } from "../features/chat/api"
import type { IChatWithUnreadMessages } from "../interfaces/chat"
import { useSocketEvent } from "./useSocketEvent"

export const useNewGroup = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.NEW_GROUP,(newChat:IChatWithUnreadMessages)=>{
        dispatch(
          chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
            draft.push(newChat)
          })
        )
      })
}
