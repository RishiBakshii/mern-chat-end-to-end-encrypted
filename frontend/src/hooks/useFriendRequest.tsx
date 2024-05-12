import { Events } from "../enums/events"
import type { IFriendRequest } from "../interfaces/friends"
import { friendsApi } from "../services/api/friendsApi"
import { useAppDispatch } from "../services/redux/store/hooks"
import { useSocketEvent } from "./useSocketEvent"

export const useFriendRequest = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.NEW_FRIEND_REQUEST,(newRequest:IFriendRequest)=>{
        dispatch(
          friendsApi.util.updateQueryData("getUserFriendRequests",undefined,(draft)=>{
            draft.push(newRequest)
          })
        )
      })
}
