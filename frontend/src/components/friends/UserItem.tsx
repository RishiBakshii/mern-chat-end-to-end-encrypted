import { IUser } from "../../interfaces/auth"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import {motion} from 'framer-motion'

type PropTypes = {
    user:Pick<IUser , '_id' | 'name' | "username" | 'avatar'>
    sendFriendRequest:(receiverId:string)=>void
    isFriendAlready:boolean
}
export const UserItem = ({user,isFriendAlready,sendFriendRequest}:PropTypes) => {

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
          loggedInUser?._id.toString() !== user._id.toString() && !isFriendAlready &&
          <motion.button whileHover={{y:-1}} whileTap={{scale:0.950}} onClick={()=>sendFriendRequest(user._id)} className="p-2 bg-primary hover:bg-primary-dark text-text rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
          </motion.button>
        }
        
    </div>
  )
}
