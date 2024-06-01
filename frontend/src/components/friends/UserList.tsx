import { IUser } from "../../interfaces/auth"
import { IFriend } from "../../interfaces/friends"
import { UserItem } from "./UserItem"

type PropTypes = {
    users:Array<Pick<IUser , "_id" | 'name' | "username" | 'avatar'>>
    friends:Array<IFriend>
    sendFriendRequest:(receiverId:string)=>void
}
export const UserList = ({users,friends,sendFriendRequest}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map((user,index)=>(
                <UserItem 
                  key={index} 
                  user={user} 
                  isFriendAlready={friends.some(friend=>friend._id===user._id)}
                  sendFriendRequest={sendFriendRequest} 
                />
            ))
        }
    </div>
  )
}
