import { MemberList } from "./TopMemberAvatars"
import { IChatWithUnreadMessages } from "../../interfaces/chat"

type PropTypes = {
    chatAdminId:string
    members:IChatWithUnreadMessages['members']
    loggedInUserId:string
}

export const MemberListWithNumber = ({members,chatAdminId,loggedInUserId}:PropTypes) => {
  return (

    <div className="flex flex-col gap-y-4">

        <h6 className="text-xl font-medium">{members.length} Members</h6>

        <MemberList 
          loggedInUserId={loggedInUserId}  
          chatAdminId={chatAdminId} 
          members={members}
        />

    </div>
    
  )
}
