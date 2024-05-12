import { ChatHeaderOptions } from "./ChatHeaderOptions"

type PropTypes = {
  totalMembers:number
  chatName:string
  openMemberForm: () => void
}

export const ChatHeader = ({totalMembers,openMemberForm,chatName}:PropTypes) => {

  return (
    <div className="flex items-center justify-between">

        <div className="flex flex-col gap-y-1">
            <h4 className="font-medium text-4xl">{chatName}</h4>
            <p className="text-gray-500">{totalMembers} Members</p>
        </div>

        <ChatHeaderOptions openMemberForm={openMemberForm}/>
    </div>

  )
}
