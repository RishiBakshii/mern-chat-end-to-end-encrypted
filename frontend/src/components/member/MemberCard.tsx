import { IChatMember } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    member:IChatMember
    isSelected?:boolean
    toggleSelection:(memberId: string) => void
}

export const MemberCard = ({member,isSelected=false,toggleSelection}:PropTypes) => {
  return (
    <div onClick={()=>toggleSelection(member._id)} className={`flex items-center gap-x-2 rounded-md cursor-pointer ${isSelected?"bg-primary hover:bg-primary-dark":'hover:bg-secondary-darker'} p-2 shadow-sm`}>
        <Avatar imgUrl={member.avatar} height={7} width={7} alt={member.username}/>
        <p>{member.username}</p>
    </div>
  )
}
