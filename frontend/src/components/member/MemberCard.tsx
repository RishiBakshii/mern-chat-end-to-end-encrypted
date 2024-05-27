import { IChatMember } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    isMemberAlready:boolean
    selectable:boolean
    member:IChatMember
    isSelected?:boolean
    toggleSelection:(memberId: string) => void
}

export const MemberCard = ({member,isSelected=false,isMemberAlready,selectable,toggleSelection}:PropTypes) => {
  return (
    <div onClick={()=>isMemberAlready?"":selectable?toggleSelection(member._id):""} className={`flex justify-between rounded-md cursor-pointer ${isSelected?"bg-primary hover:bg-primary-dark":'hover:bg-secondary-darker'} p-2 shadow-sm`}>
        
        <div className="flex gap-x-2 items-center">
          <Avatar imgUrl={member.avatar} height={7} width={7} alt={member.username}/>
          <p>{member.username}</p>
        </div>
        
        {
          isMemberAlready && 
          <p className="">member</p>
        }
    </div>
  )
}
