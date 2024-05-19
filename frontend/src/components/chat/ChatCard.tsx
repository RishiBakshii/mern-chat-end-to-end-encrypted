import { TypingIndicator } from "../ui/TypingIndicator"

type PropTypes = {
  chatId:string
  chatName:string
  avatar:string
  unreadMessageCount:number
  latestUnreadMessage:string
  isTyping:boolean
  updateSelectedChatId:(chatId:string)=>void
}

export const ChatCard = ({chatName,avatar,chatId,unreadMessageCount,latestUnreadMessage,isTyping,updateSelectedChatId}:PropTypes) => {

  return (
    <div onClick={()=>updateSelectedChatId(chatId)} className="text-text flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3">

        <img className="aspect-square w-16 rounded-full object-cover" src={avatar} />
        
        <div className="w-full">

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-x-2">
                    <p className="font-medium">{chatName}</p>
                    {isTyping && <TypingIndicator w={12}/>}
                </div>

                <div className="flex flex-col">
                    <p  className="text-sm text-secondary-darker">{1}m</p>
                    { unreadMessageCount > 0 && 
                      <p className="bg-primary flex items-center justify-center text-white rounded-full w-6 h-6">
                        { unreadMessageCount }
                      </p>
                    }
                </div>
            </div>
            
            <p className="text-sm text-secondary-darker">
              {
                latestUnreadMessage && 
               `${latestUnreadMessage.substring(0,25)}...`
              }
            </p>

        </div>

    </div>
  )
}