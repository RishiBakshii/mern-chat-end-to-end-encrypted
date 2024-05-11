import { MemberList } from "../../features/chat/components/MemberList"
import { IChatWithUnreadMessages } from "../../interfaces/chat"

type PropTypes = {
    chatAdminId:string
    members:IChatWithUnreadMessages['members']
    loggedInUserId:string
}

export const MemberListWithNumber = ({members,chatAdminId,loggedInUserId}:PropTypes) => {
  return (
    <div>
        <h6 className="text-xl font-medium">{members.length} Members</h6>
        <MemberList loggedInUserId={loggedInUserId}  chatAdminId={chatAdminId} 
        members={members}/>
    </div>
  )
}
