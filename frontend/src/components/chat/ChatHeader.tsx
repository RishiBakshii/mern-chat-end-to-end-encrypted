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
                <p className="text-secondary-darker">{onlineMembers} {onlineMembers===1?"online":"online"}</p>
              </div>
    }

    else{

      const otherMember = selectedChatDetails.members.filter((member) => member._id !== loggedInUserId)[0];

      return otherMember.isActive ? 
        <div className="flex items-center gap-x-2">
        <ActiveDot/>
        <p className="text-secondary-darker">Active</p>
        </div>
        :
        null
    }
  }


  return (
    <div className="flex items-center justify-between text-text bg-background">

        <div onClick={()=>is2xl?toggleChatDetailsBar():""} className="flex flex-col gap-y-1">

          <div className="flex gap-x-3">
              <Avatar imgUrl={chatAvatar} height={14} width={14} alt={`${chatName} avatar`} />

              <div className="flex flex-col gap-y-1">

                  <div className="flex flex-col gap-y-1">
                      <h4 className="font-medium text-4xl text-fluid-h4">{chatName}</h4>

                      <div className="flex items-center gap-x-2">
                        {
                          !isGroupChat && lastSeen && 
                          <p className="text-secondary-darker">last seen {formatRelativeTime(lastSeen)}</p>
                        }
                        {
                          isGroupChat && 
                          <p className="text-secondary-darker text-fluid-p">{totalMembers} Members</p>
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
