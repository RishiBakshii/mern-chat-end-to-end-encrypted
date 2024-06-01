import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { TypingIndicator } from "../ui/TypingIndicator"
import { TypingUserList } from "./TypingUserList"

type PropTypes = {
    users: IChatWithUnreadMessages['userTyping']
    isGroupChat:boolean
}

export const TypingIndicatorWithUserList = ({users,isGroupChat}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3 self-start">
        {
        users.length > 0 && 
          <div className="w-24 max-xl:w-20">
            <TypingIndicator/>
          </div>
        } 
        {
          isGroupChat &&
          <TypingUserList users={users}/>
        }
    </div>

  )
}
