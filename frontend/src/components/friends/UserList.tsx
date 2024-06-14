import { IUser } from "../../interfaces/auth"
import { IFriend } from "../../interfaces/friends"
import { UserItem } from "./UserItem"

type PropTypes = {
    users:Array<Pick<IUser , "_id" | 'name' | "username" | 'avatar'>>
    friends:Array<IFriend>
    loggedInUserId: string
    sendFriendRequest:(receiverId:string)=>void
}
export const UserList = ({users,friends,loggedInUserId,sendFriendRequest}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map((user,index)=>(
                <UserItem 
                  key={index} 
                  user={user} 
                  loggedInUserId={loggedInUserId}
                  isFriendAlready={friends.some(friend=>friend._id===user._id)}
                  sendFriendRequest={sendFriendRequest} 
                />
            ))
        }
    </div>
  )
}
