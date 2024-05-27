import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery"
import { ChatHeaderOptions } from "./ChatHeaderOptions"

type PropTypes = {
  isGroupChat:boolean
  totalMembers:number
  chatName:string
  openRemoveMemberForm: () => void
  toggleChatDetailsBar: () => void
}

export const ChatHeader = ({totalMembers,chatName,isGroupChat,openRemoveMemberForm,toggleChatDetailsBar}:PropTypes) => {
  
  const is2xl = useMediaQuery(1536)

  return (
    <div className="flex items-center justify-between text-text bg-background">

        <div onClick={()=>is2xl?toggleChatDetailsBar():""} className="flex flex-col gap-y-1">
            <h4 className="font-medium text-4xl text-fluid-h4">{chatName}</h4>
            <p className="text-secondary-darker text-fluid-p">{totalMembers} Members</p>
        </div>

        <ChatHeaderOptions 
         isGroupChat={isGroupChat}
         openRemoveMemberForm={openRemoveMemberForm}
        />
    </div>

  )
}
