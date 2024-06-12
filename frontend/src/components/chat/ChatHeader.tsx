import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery"
import { ICallOutEventPayloadData } from "../../interfaces/callIn"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { formatRelativeTime } from "../../utils/helpers"
import { ActiveDot } from "../ui/ActiveDot"

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
  const otherMember = selectedChatDetails.members.filter((member) => member._id !== loggedInUserId)[0];
  
  const renderOnlineStatus = ()=>{

    if(isGroupChat){

      const onlineMembers = selectedChatDetails.members.filter((member) => member._id !== loggedInUserId && member.isActive).length
      
      return <div className="flex items-center gap-x-2">
                <ActiveDot/>
                <p className="text-secondary-darker max-sm:text-sm">{onlineMembers} {onlineMembers===1?"online":"online"}</p>
              </div>
    }

    else{

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

                      <div className="flex items-center gap-x-1">
                          <h4 className="font-medium text-4xl max-sm:text-2xl">{chatName}</h4>
                          {
                            !isGroupChat && otherMember.verificationBadge &&
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 max-sm:size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                          }
                      </div>

                      <div className="flex items-center gap-x-2">
                        {
                          !isGroupChat && !otherMember.isActive && lastSeen && 
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
