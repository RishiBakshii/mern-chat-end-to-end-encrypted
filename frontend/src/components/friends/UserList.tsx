import { IUser } from "../../interfaces/auth"
import { UserItem } from "./UserItem"

type PropTypes = {
    users:Array<Pick<IUser , "_id" | 'name' | "username" | 'avatar'>>
    sendFriendRequest:(receiverId:string)=>void
}
export const UserList = ({users,sendFriendRequest}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map((user,index)=>(
                <UserItem key={index} user={user} sendFriendRequest={sendFriendRequest} />
            ))
        }
    </div>
  )
}
