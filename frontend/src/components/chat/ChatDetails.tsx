import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { Avatar } from "../ui/Avatar"
import { AddMemberSection } from "./AddMemberSection"
import { SharedMedia } from "./SharedMedia"
import { AvatarList } from "../shared/AvatarList"
import { IAttachment } from "../../interfaces/attachment"


type PropTypes = {
    isAdmin:boolean
    isGroupChat:boolean
    chatAvatar:string
    chatName:string
    members:IChatWithUnreadMessages['members']
    attachments:IAttachment
    isAttachmentsFetching:boolean
    selectedChatId:string
    toggleChatDetailsBar: () => void
    fetchMoreAttachments: (chatId: string, page: number) => void
}

export const ChatDetails = ({isAdmin,chatName,chatAvatar,members,isGroupChat,attachments,selectedChatId,toggleChatDetailsBar,fetchMoreAttachments}:PropTypes) => {

  return (
    
    <div className="flex flex-col justify-center items-center gap-y-7 text-text relative">
        
        <button onClick={toggleChatDetailsBar} className="absolute left-0 top-1 hidden max-2xl:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>

        <h5 className="font-medium text-xl text-fluid-h5">Chat Details</h5>
        
        <div className="flex flex-col gap-y-4 items-center">

            <Avatar
              alt="chat avatar"
              imgUrl={chatAvatar}
              width={20}
              height={20}
            />

            <div className="flex flex-col justify-center items-center">
                <h4 className="text-lg font-medium">{chatName}</h4>
                <p className="text-secondary-darker">{members?.length} members</p>
            </div>
            
        </div>

        <div className="flex flex-col gap-y-6 w-full">
            
            <div className="flex flex-col gap-y-4">

                <div className="flex justify-between items-center">

                    <div className="flex items-center">

                        <AvatarList w={8} h={8} avatars={members.slice(0,4).map(member=>member.avatar)}/>
                        {
                          ((members.length-4)>0) && 
                          <p className="w-8 h-8 rounded-full bg-secondary flex justify-center items-center">+{members.length-4}</p>
                        }
                    </div>

                    {isGroupChat && <p>See all</p>}

                </div>

                {
                  isAdmin && isGroupChat && <AddMemberSection/>
                }

            </div>
            {
              <SharedMedia
                selectedChatId={selectedChatId}
                attachments={attachments}
                fetchMoreAttachments={fetchMoreAttachments}
              />
            }

        </div>

    </div>
  )
}
