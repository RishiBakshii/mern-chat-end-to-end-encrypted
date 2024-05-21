import { useAcceptOrRejectFriendRequest } from "../../hooks/userRequest/useAcceptOrRejectFriendRequest"
import { IFriendRequest } from "../../interfaces/request"
import { useGetUserFriendRequestsQuery } from "../../services/api/requestApi"
import { FriendRequestList } from "./FriendRequestList"


export const FriendRequestForm = () => {

    const {data:friendRequests} = useGetUserFriendRequestsQuery()

    const {handleFriendRequest} = useAcceptOrRejectFriendRequest()

    const friendRequestHandler = (requestId:IFriendRequest['_id'],action:"accept" | "reject") =>{
      handleFriendRequest({requestId,action})
    }

  return (
    <div>
        {
        friendRequests ? 
        <FriendRequestList users={friendRequests} friendRequestHandler={friendRequestHandler}/>:
        <p>There are no friend requests</p>
        }
    </div>
  )
}
