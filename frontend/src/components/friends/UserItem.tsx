import { motion } from 'framer-motion'
import { IUser } from "../../interfaces/auth"

type PropTypes = {
    user:Pick<IUser , '_id' | 'name' | "username" | 'avatar'>
    sendFriendRequest:(receiverId:string)=>void
    isFriendAlready:boolean
    loggedInUserId: string
}
export const UserItem = ({user,isFriendAlready,loggedInUserId,sendFriendRequest}:PropTypes) => {

  const isUserItself = loggedInUserId === user._id.toString()

  return (
    <div className="p-2 flex items-center justify-between">

        <div className="flex gap-x-2">
            <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt={`${user.username} avatar`} />
            <div className="flex flex-col">
                <div className='flex items-center gap-x-2'>
                    <h6>{user.username}</h6>
                    <p className='text-sm bg-secondary-darker px-1 rounded-e-md'>{isUserItself && 'You'}</p>
                </div>
                <p className="text-secondary-darker font-light">{user.name}</p>
            </div>
        </div>
        {
          !isUserItself && !isFriendAlready &&
          <motion.button whileHover={{y:-1}} whileTap={{scale:0.950}} onClick={()=>sendFriendRequest(user._id)} className="p-2 bg-primary hover:bg-primary-dark text-text rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
          </motion.button>
        }
        
    </div>
  )
}
