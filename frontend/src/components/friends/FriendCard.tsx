import { motion } from "framer-motion"
import { IFriend } from "../../interfaces/friends"

type PropTypes = {
    friend:IFriend
    handleAddOrRemoveMember:(newMember: string) => void
    selectedMembers:Array<string>
}

export const FriendCard = ({friend,selectedMembers,handleAddOrRemoveMember}:PropTypes) => {
  return (
    <motion.div whileHover={{x:-1}} whileTap={{scale:0.980}} onClick={_=>handleAddOrRemoveMember(friend._id)} className={`flex items-center select-none gap-x-2 ${selectedMembers.includes(friend._id)?"bg-primary text-white hover:bg-primary-dark shadow-2xl":"bg-secondary text-text hover:bg-secondary-darker"} p-2 rounded-lg cursor-pointer`}>
        <img className="h-7 w-7 object-cover rounded-full" src={friend.avatar} alt={`${friend.username} avatar`} />
        <p className="text-inherit">{friend.username}</p>
    </motion.div>
  )
}
