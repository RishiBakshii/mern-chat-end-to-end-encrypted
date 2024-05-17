import { Events } from "../../enums/events"
import type { IFriendRequest } from "../../interfaces/friends"
import { requestApi } from "../../services/api/requestApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useFriendRequestListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.NEW_FRIEND_REQUEST,(newRequest:IFriendRequest)=>{
        dispatch(
          requestApi.util.updateQueryData("getUserFriendRequests",undefined,(draft)=>{
            draft.push(newRequest)
          })
        )
      })
}
