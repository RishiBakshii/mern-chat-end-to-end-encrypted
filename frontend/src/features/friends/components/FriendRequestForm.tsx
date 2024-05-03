import { useGetUserFriendRequestsQuery } from "../api"
import { FriendRequestList } from "./FriendRequestList"


export const FriendRequestForm = () => {

    const {data:friendRequests} = useGetUserFriendRequestsQuery()

  return (
    <div>
        {
        friendRequests ? 
        <FriendRequestList users={friendRequests}/>:
        <p>There are no friend requests</p>
        }
    </div>
  )
}
