import { IChatMember, IChatWithUnreadMessages } from "../../interfaces/chat"
import { IFriend } from "../../interfaces/friends"
import { MemberCard } from "./MemberCard"

type PropTypes = {
    selectable:boolean
    existingMembers?:IChatWithUnreadMessages['members'] | []
    members:Array<IChatMember> | Array<IFriend>
    selectedMembers:Array<string>
    toggleSelection: (memberId: string) => void
}

export const MemberList = ({members,selectedMembers,selectable,existingMembers,toggleSelection}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
        {
            members.map(member=>(
                <MemberCard
                  isMemberAlready={existingMembers?existingMembers?.map(member=>member._id).includes(member._id):false}
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
