import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery"
import { ICallOutEventPayloadData } from "../../interfaces/callIn"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { formatRelativeTime } from "../../utils/helpers"
import { ActiveDot } from "../ui/ActiveDot"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
  handleCallOut: (payload: ICallOutEventPayloadData) => void
  selectedChatName:string
  loggedInUserId:string
  totalMembers:number
  chatName:string
  chatAvatar:string
  isGroupChat:boolean
  lastSeen:Date | null
  selectedChatDetails:IChatWithUnreadMessages
  toggleChatDetailsBar: () => void
}

export const ChatHeader = ({loggedInUserId,totalMembers,selectedChatDetails,lastSeen,chatName,chatAvatar,isGroupChat,toggleChatDetailsBar}:PropTypes) => {
  
  const is2xl = useMediaQuery(1536)
  
  const renderOnlineStatus = ()=>{

    if(isGroupChat){

      const onlineMembers = selectedChatDetails.members.filter((member) => member._id !== loggedInUserId && member.isActive).length
      
      return <div className="flex items-center gap-x-2">
                <ActiveDot/>
                <p className="text-secondary-darker max-sm:text-sm">{onlineMembers} {onlineMembers===1?"online":"online"}</p>
              </div>
    }

    else{

      const otherMember = selectedChatDetails.members.filter((member) => member._id !== loggedInUserId)[0];

      return otherMember.isActive ? 
        <div className="flex items-center gap-x-2">
        <ActiveDot/>
        <p className="text-secondary-darker max-sm:text-sm">Active</p>
        </div>
        :
        null
    }
  }


  return (
    <div className="flex items-center justify-between text-text">

        <div onClick={()=>is2xl?toggleChatDetailsBar():""} className="flex flex-col gap-y-1">

          <div className="flex gap-x-3">

              <img className="w-14 h-14 rounded-full max-sm:w-10 max-sm:h-10" src={chatAvatar} alt={`${chatName} avatar`} />

              <div className="flex flex-col gap-y-1">

                  <div className="flex flex-col gap-y-1 max-sm:gap-y-[.5px]">
                      <h4 className="font-medium text-4xl max-sm:text-2xl">{chatName}</h4>

                      <div className="flex items-center gap-x-2">
                        {
                          !isGroupChat && lastSeen && 
                          <p className="text-secondary-darker max-sm:text-sm">last seen {formatRelativeTime(lastSeen)}</p>
                        }
                        {
                          isGroupChat && 
                          <p className="text-secondary-darker max-sm:text-sm">{totalMembers} Members</p>
                        }
                        {renderOnlineStatus()}
                      </div>
                  </div>
              </div>
          </div>

        </div>

    </div>

  )
}
