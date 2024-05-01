import { IChatWithUnreadMessages } from "../../../interfaces/chat"
import { MemberItem } from "./MemberItem"

type PropTypes = {
  members:IChatWithUnreadMessages['members'] | undefined
}
export const MemberList = ({members}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
        {
            members?.map(member=>
                <MemberItem member={member}/>
            )
        }
    </div>
  )
}
