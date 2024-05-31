import { IFriend } from "../../interfaces/friends"
import { ActiveDot } from "../ui/ActiveDot"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    friend: IFriend
    sendCallInRequest: (callee: string) => void
}

export const CallInFriendCard = ({friend:{_id,avatar,isActive,username},sendCallInRequest}:PropTypes) => {
  return (
    <div onClick={()=>sendCallInRequest(_id)} className="flex items-center gap-x-2 cursor-pointer">

        <Avatar imgUrl={avatar} height={14} width={14} alt={username}/>
        <p>{username}</p>
        {isActive && <ActiveDot/>}

    </div>
  )
}
