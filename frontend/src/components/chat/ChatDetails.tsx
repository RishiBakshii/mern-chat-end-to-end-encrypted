import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"
import { AddMember } from "./AddMember"
import { MemberList } from "./MemberList"
import { SharedMedia } from "./SharedMedia"

type PropTypes = {
    isGroupChat:boolean
    chatAvatar:string
    chatName:string
    members:IChatWithUnreadMessages['members']
}

export const ChatDetails = ({chatName,chatAvatar,members,isGroupChat}:PropTypes) => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-7">
        
        <h5 className="font-medium text-xl">Chat Details</h5>
        
        <div className="flex flex-col gap-y-4 items-center">
            <Avatar
              alt="chat avatar"
              imgUrl={chatAvatar}
              width={20}
              height={20}
            />
            <div className="flex flex-col gap-y-0 items-center">
                <h4 className="text-lg font-medium">{chatName}</h4>
                <p className="text-gray-500">{members?.length} members</p>
            </div>
        </div>

        <div className="flex flex-col gap-y-6 w-full">
            
            <div className="flex flex-col gap-y-4">

                <MemberList
                  isGroupChat={isGroupChat}
                  members={members}
                />

                {
                    isGroupChat && <AddMember/>
                }

            </div>

            <SharedMedia/>

        </div>

    </div>
  )
}
