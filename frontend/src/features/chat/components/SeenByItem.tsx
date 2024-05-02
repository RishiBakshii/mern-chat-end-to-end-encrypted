import type { IChatMember } from "../../../interfaces/chat"

type PropTypes = {
    member: IChatMember
}
export const SeenByItem = ({member}:PropTypes) => {
  return (
    <img className="rounded-full w-7 h-7" src={member.avatar} alt={`${member.username} avatar`} />
  )
}
