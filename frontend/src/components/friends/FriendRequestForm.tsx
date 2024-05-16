import { useToast } from "../../hooks/useUI/useToast"
import { IFriendRequest } from "../../interfaces/friends"
import { useGetUserFriendRequestsQuery, useHandleFriendRequestMutation } from "../../services/api/friendsApi"
import { FriendRequestList } from "./FriendRequestList"


export const FriendRequestForm = () => {

    const {data:friendRequests} = useGetUserFriendRequestsQuery()

    const [
      handleFriendRequestTrigger,{
      error,
      isError,
      isLoading,
      isSuccess,
      isUninitialized,
    }] = useHandleFriendRequestMutation()

    useToast({
      error,
      isError,
      isLoading,
      isSuccess,
      isUninitialized,
      successMessage:"Friend request accepted",
      loaderToast:true,
      successToast:true
    })

    const friendRequestHandler = (requestId:IFriendRequest['_id'],action:"accept" | "reject") =>{
      handleFriendRequestTrigger({requestId,action})
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
