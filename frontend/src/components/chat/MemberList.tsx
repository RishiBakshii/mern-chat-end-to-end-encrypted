import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    isGroupChat:boolean
    members:IChatWithUnreadMessages['members']
}

export const MemberList = ({members,isGroupChat}:PropTypes) => {
  return (
    <div className="flex items-center justify-between">

        <div className="flex items-center">
            {
                members.slice().map(({avatar,username,_id})=>(
                    <Avatar key={_id} imgUrl={avatar} width={7} height={7} alt={username}/>
                ))
            }
        </div>
        
        {
            isGroupChat && 
            <button>See all</button>
        }
    </div>
  )
}
