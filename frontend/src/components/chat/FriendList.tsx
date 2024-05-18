import { IFriend } from "../../interfaces/friends"
import { FriendCard } from "../friends/FriendCard"

type PropTypes = {
    friends:Array<IFriend>
    handleAddOrRemoveMember:(newMember: string) => void
    selectedMembers:Array<string>
}

export const FriendList = ({friends,handleAddOrRemoveMember,selectedMembers}:PropTypes) => {
  return (
    <div className="flex flex-wrap gap-3">
        {
            friends.map((friend)=>(

                <FriendCard
                 key={friend._id}
                 friend={friend}
                 handleAddOrRemoveMember={handleAddOrRemoveMember}
                 selectedMembers={selectedMembers}
                />
            ))
        }
    </div>
  )
}
