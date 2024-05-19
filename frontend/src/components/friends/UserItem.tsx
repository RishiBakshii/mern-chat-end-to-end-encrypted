import { IUser } from "../../interfaces/auth"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

type PropTypes = {
    user:Pick<IUser , '_id' | 'name' | "username" | 'avatar'>
    sendFriendRequest:(receiverId:string)=>void
}
export const UserItem = ({user,sendFriendRequest}:PropTypes) => {

  const loggedInUser = useAppSelector(selectLoggedInUser)

  return (
    <div className="p-2 flex items-center justify-between">

        <div className="flex gap-x-2">
            <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt={`${user.username} avatar`} />
            <div className="flex flex-col">
                <h6>{user.username}</h6>
                <p className="text-secondary-darker font-light">{user.name}</p>
            </div>
        </div>
        {
          loggedInUser?._id.toString() !== user._id.toString() && 
          <button onClick={()=>sendFriendRequest(user._id)} className="p-2 bg-primary hover:bg-primary-dark text-white shadow-lg h-10 w-10 rounded-full">+</button>
        }
        
    </div>
  )
}
