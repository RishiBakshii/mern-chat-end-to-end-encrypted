import { IFriendRequest } from "../../../interfaces/friends"
import { FriendRequestItem } from "./FriendRequestItem"

type PropTypes = {
    users:Array<IFriendRequest>
}
export const FriendRequestList = ({users}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map(user=>(
                <FriendRequestItem user={user}/>
            ))
        }
    </div>
  )
}
