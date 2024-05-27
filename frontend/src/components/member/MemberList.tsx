import { IChatMember } from "../../interfaces/chat"
import { MemberCard } from "./MemberCard"

type PropTypes = {
    selectable:boolean
    members:Array<IChatMember>
    selectedMembers:Array<string>
    toggleSelection: (memberId: string) => void
}

export const MemberList = ({members,selectedMembers,selectable,toggleSelection}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
        {
            members.map(member=>(
                <MemberCard
                  selectable={selectable}
                  key={member._id}
                  member={member}
                  isSelected={selectedMembers.includes(member._id)}
                  toggleSelection={toggleSelection}
                />
            ))
        }        
    </div>
  )
}
