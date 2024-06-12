import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { Events } from "../../enums/events"
import type { IChatWithUnreadMessages } from "../../interfaces/chat"
import { chatApi } from "../../services/api/chatApi"
import { useSocketEvent } from "../useSocket/useSocketEvent"
import { friendApi } from "../../services/api/friendApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { IFriend } from "../../interfaces/friends"

export const useNewGroupListener = () => {

    const dispatch = useAppDispatch()
    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id

    useSocketEvent(Events.NEW_GROUP,(newChat:IChatWithUnreadMessages)=>{

        if(loggedInUserId && !newChat.isGroupChat){

          const member = newChat.members.filter(member=>member._id!==loggedInUserId)[0]

          if(member){

            const newFriend :IFriend = {
              _id:member._id,
              avatar:member.avatar,
              createdAt: new Date,
              isActive:true,
              username:member.username,
              lastSeen:member.lastSeen,
              publicKey:member.publicKey,
              verificationBadge:member.verificationBadge

            }

            dispatch(
              friendApi.util.updateQueryData("getFriends",undefined,(draft)=>{
                draft.push(newFriend)
              })
            )

          }

        }

        dispatch(
          chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
            draft.push(newChat)
          })
        )
      })
}
