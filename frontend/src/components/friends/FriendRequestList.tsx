import { IFriendRequest } from "../../interfaces/friends"
import { FriendRequestItem } from "./FriendRequestItem"

type PropTypes = {
    users:Array<IFriendRequest>
    friendRequestHandler:(requestId: IFriendRequest['_id'], action: "accept" | "reject") => void
}
export const FriendRequestList = ({users,friendRequestHandler}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map(user=>(
                <FriendRequestItem user={user} friendRequestHandler={friendRequestHandler}/>
            ))
        }
    </div>
  )
}
