import { IUnreadMessage } from "../../interfaces/messages"
import { TypingIndicator } from "../ui/TypingIndicator"

type PropTypes = {
  chatId:string
  chatName:string
  avatar:string
  unreadMessage:IUnreadMessage
  isTyping:boolean
  updateSelectedChatId:(chatId:string)=>void
  toggleChatBar:()=>void
}

export const ChatCard = ({chatName,avatar,chatId,unreadMessage,isTyping,updateSelectedChatId,toggleChatBar}:PropTypes) => {

  return (
    <div onClick={()=>{updateSelectedChatId(chatId);toggleChatBar()}} className="text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3">

        <img className="aspect-square w-16 rounded-full object-cover max-md:w-14" src={avatar} />

        <div className="w-full flex flex-col gap-y-1">

            <div className="flex items-center gap-x-2 justify-between w-full">

                <div className="flex items-center gap-x-2">
                    <p className="font-medium">{chatName}</p>
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