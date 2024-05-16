import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { TypingIndicator } from "../ui/TypingIndicator"
import { TypingUserList } from "./TypingUserList"

type PropTypes = {
    users: IChatWithUnreadMessages['userTyping']
}

export const TypingIndicatorWithUserList = ({users}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3 self-start">
        {users.length > 0 && 
        <TypingIndicator/>
        } 
        <TypingUserList users={users}/>
    </div>

  )
}
