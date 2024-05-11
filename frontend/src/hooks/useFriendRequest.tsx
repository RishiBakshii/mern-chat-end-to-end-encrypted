import { useAppDispatch } from "../app/hooks"
import { Events } from "../enums/events"
import { friendsApi } from "../features/friends/api"
import type { IFriendRequest } from "../interfaces/friends"
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
