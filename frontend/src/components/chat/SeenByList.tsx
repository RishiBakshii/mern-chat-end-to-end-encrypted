import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    members:IChatWithUnreadMessages['seenBy']
}

export const SeenByList = ({members}:PropTypes) => {
  return (
    <div className="flex item-center flex-wrap self-end gap-x-1">
      {
        members.map(member=>(
          <Avatar 
            imgUrl={member.avatar} 
            height={7} 
            width={7} 
            username={member.username}
           />
        ))
      }
    </div>
  )
}
