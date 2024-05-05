import { IChatWithUnreadMessages } from "../../../interfaces/chat"
import { MemberItem } from "./MemberItem"

type PropTypes = {
  members:IChatWithUnreadMessages['members'] | undefined
  loggedInUserId:string
  chatAdminId?:string
  isRemovable?:boolean
  chatId?:string
  isGroupChat?:boolean
  removeHandler?:(chatId: string, memberId: string) => void
}
export const MemberList = ({members,chatAdminId,loggedInUserId,isRemovable=false,removeHandler,chatId,isGroupChat}:PropTypes) => {
  
  return (
    <div className="flex flex-col gap-y-2">
        {
            members?.map(member=>
                <MemberItem isGroupChat={isGroupChat} chatId={chatId} isRemovable={isRemovable} removeHandler={removeHandler} member={member} chatAdminId={chatAdminId} loggedInUserId={loggedInUserId}/>
            )
        }
    </div>
  )
}
