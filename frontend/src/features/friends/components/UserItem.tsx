import { useAppSelector } from "../../../app/hooks"
import { IUser } from "../../../interfaces/auth"
import { selectLoggedInUser } from "../../auth/authSlice"

type PropTypes = {
    user:Pick<IUser , '_id' | 'name' | "username" | 'avatar'>
    sendFriendRequest:(receiverId:string)=>void
}
export const UserItem = ({user,sendFriendRequest}:PropTypes) => {

  const loggedInUser = useAppSelector(selectLoggedInUser)

  return (
    <div className="p-2 flex bg-gray-100  items-center justify-between hover:bg-gray-200">

        <div className="flex gap-x-2">
            <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt={`${user.username} avatar`} />
            <div className="flex flex-col">
                <h6>{user.username}</h6>
                <p className="text-gray-500 font-light">{user.name}</p>
            </div>
        </div>
        {
          loggedInUser?._id.toString() !== user._id.toString() && 
          <button onClick={()=>sendFriendRequest(user._id)} className="p-2 bg-violet-500 hover:bg-violet-600 text-white shadow-lg h-10 w-10 rounded-full">+</button>
        }
        
    </div>
  )
}
