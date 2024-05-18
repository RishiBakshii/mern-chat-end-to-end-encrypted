import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"
import { AddMemberSection } from "./AddMemberSection"
import { SharedMedia } from "./SharedMedia"
import { AvatarList } from "../shared/AvatarList"

type PropTypes = {
    isAdmin:boolean
    isGroupChat:boolean
    chatAvatar:string
    chatName:string
    members:IChatWithUnreadMessages['members']
}

export const ChatDetails = ({isAdmin,chatName,chatAvatar,members,isGroupChat}:PropTypes) => {
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

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <AvatarList w={8} h={8} avatars={members.slice(0,4).map(member=>member.avatar)}/>
                      {
                        ((members.length-4)>0) && 
                        <p className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center">+{members.length-4}</p>
                      }
                    </div>
                    {isGroupChat && <p>See all</p>}
                </div>

                {
                  isAdmin && isGroupChat && <AddMemberSection/>
                }

            </div>

            <SharedMedia/>

        </div>

    </div>
  )
}
