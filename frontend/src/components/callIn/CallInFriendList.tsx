import { IFriend } from "../../interfaces/friends"
import { CallInFriendCard } from "./CallInFriendCard"

type PropTypes = {
    friends:Array<IFriend>
    sendCallInRequest: (callee: string) => void
}

export const CallInFriendList = ({friends,sendCallInRequest}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-4">
        {
            friends.map(friend=>(
                <CallInFriendCard 
                  key={friend._id} 
                  friend={friend}
                  sendCallInRequest={sendCallInRequest}
                />
            ))
        }
    </div>
  )
}
