import { ChatHeader } from "../../features/chat/components/ChatHeader"
import { MessageList } from "../../features/messages/components/MessageList"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { IMessage } from "../../interfaces/messages"
import { MessageForm } from "./MessageForm"

type PropTypes = {
    loggedInUserId:string
    isGroupChat:boolean,
    messages:Array<IMessage>
    members:IChatWithUnreadMessages['members']
    chatName?:string
    isTyping:boolean
    openMemberForm:()=>void
}

export const ChatArea = ({loggedInUserId,isGroupChat,messages,chatName,members,isTyping,openMemberForm}:PropTypes) => {
  return (
            <>
            <div className="flex flex-row justify-between items-center">

                <ChatHeader  
                    openMemberForm={openMemberForm}
                    isGroupChat={isGroupChat}
                    isTyping={isTyping}
                    members={members}
                    chatName={chatName}
                />

            </div>

            <div className="h-full flex px-2 flex-col gap-y-5 overflow-y-scroll">
                {
                <MessageList
                    isGroupChat={isGroupChat} 
                    messages={messages} 
                    loggedInUserId={loggedInUserId}
                />
                }
            </div>

            <MessageForm/>
            </>      
  )
}  
