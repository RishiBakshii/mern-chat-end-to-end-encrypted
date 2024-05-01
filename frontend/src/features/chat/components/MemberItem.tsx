import type { IChatMember } from "../../../interfaces/chat"

type PropTypes = {
  member: IChatMember
}
export const MemberItem = ({member}:PropTypes) => {
  return (
    <div className="flex gap-x-2 items-center hover:bg-gray-100">
        <img className="aspect-square object-cover w-[4rem] rounded" 
        src={member.avatar} 
        alt={`${member.username} avatar`} />
        <p className="font-medium text-base">{member.username}</p>
    </div>
  )
}
