import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { IUnreadMessage } from "../../interfaces/messages"
import { ActiveDot } from "../ui/ActiveDot"
import { TypingIndicator } from "../ui/TypingIndicator"

type PropTypes = {
  chatId:string
  chatName:string
  isGroupChat:boolean
  members:IChatWithUnreadMessages['members']
  avatar:string
  loggedInUserId:string
  unreadMessage:IUnreadMessage
  isTyping:boolean
  isMd:boolean
  selectedChatId:string | undefined
  updateSelectedChatId:(chatId:string)=>void
  toggleChatBar:()=>void
  clearExtraPreviousMessages: (chatId: string) => void
}

export const ChatCard = ({chatName,isGroupChat,loggedInUserId,clearExtraPreviousMessages,members,selectedChatId,avatar,isMd,chatId,unreadMessage,isTyping,updateSelectedChatId,toggleChatBar}:PropTypes) => {

  const handleChatCardClick = (chatId:string) =>{

    if(selectedChatId!==chatId){
      if(selectedChatId){
        clearExtraPreviousMessages(selectedChatId)
      }
      updateSelectedChatId(chatId)
    }

    if(isMd){
      toggleChatBar()
    }

  }

  const renderOnlineStatus = () => {

    if (isGroupChat) {

      const onlineMembers = members.filter((member) => member._id !== loggedInUserId && member.isActive).length;

      return onlineMembers > 0 ? 
        <div className="text-sm text-secondary-darker flex items-center gap-x-1 ml-1">
          <ActiveDot/>
          <p>{onlineMembers} online</p>
        </div>
        : 
       null;
    } 
    
    else {
      const otherMember = members.find((member) => member._id !== loggedInUserId);
      return otherMember?.isActive ? 
        <ActiveDot/>
        : 
        null
    }
  };


  return (
    <div onClick={()=>handleChatCardClick(chatId)} className={` ${selectedChatId===chatId?"bg-secondary-dark":""}  text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3`}>

        <img className="aspect-square w-16 rounded-full object-cover max-md:w-14" src={avatar} />

        <div className="w-full flex flex-col gap-y-1">

            <div className="flex items-center gap-x-2 justify-between w-full">

                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-1">
                        <p className="font-medium">{chatName}</p>
                        {renderOnlineStatus()}
                    </div>
                    {
                      isTyping && 
                      <div className="w-14 max-lg:w-12">
                        <TypingIndicator/>
                      </div>
                    }
                </div>
                
                <p className="text-sm text-secondary-darker">{1}m</p>

            </div>

            <div className="flex justify-between items-center">
                
                  <p className="text-sm text-secondary-darker">
                    {
                      unreadMessage?.message?.poll?
                      "Sent a poll"
                      :
                      unreadMessage?.message?.url ? 
                      "Sent a gif"
                      :
                      unreadMessage?.message?.attachments ? 
                      "Sent an attachment"
                      :
                      unreadMessage?.message?.content ?
                      `${unreadMessage.message.content}...`:""
                    }
                  </p>
                { 
                  unreadMessage.count > 0 && 
                  <p className="bg-primary flex items-center justify-center text-white rounded-full h-5 w-5 p-2">
                    { unreadMessage?.count }
                  </p>
                }
            </div>

        </div>

    </div>
  )
}