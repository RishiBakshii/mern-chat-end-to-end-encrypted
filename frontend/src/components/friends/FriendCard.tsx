import { IFriend } from "../../interfaces/friends"

type PropTypes = {
    friend:IFriend
    handleAddOrRemoveMember:(newMember: string) => void
    selectedMembers:Array<string>
}

export const FriendCard = ({friend,selectedMembers,handleAddOrRemoveMember}:PropTypes) => {
  return (
    <div onClick={_=>handleAddOrRemoveMember(friend._id)} className={`flex items-center gap-x-2 ${selectedMembers.includes(friend._id)?"bg-violet-500 text-white hover:bg-violet-600 shadow-2xl":"bg-gray-200 text-black hover:bg-gray-300"} p-2 rounded-lg cursor-pointer`}>
        <img className="h-7 w-7 object-cover rounded-full" src={friend.avatar} alt={`${friend.username} avatar`} />
        <p className="text-inherit">{friend.username}</p>
    </div>
  )
}
