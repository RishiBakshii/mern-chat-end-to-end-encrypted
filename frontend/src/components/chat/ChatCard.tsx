
type PropTypes = {
  chatId:string
  chatName:string
  avatar:string
  unreadMessageCount:number
  latestUnreadMessage:string
  updateSelectedChatId:(chatId:string)=>void
}

export const ChatCard = ({chatName,avatar,chatId,unreadMessageCount,latestUnreadMessage,updateSelectedChatId}:PropTypes) => {

  return (
    <div onClick={()=>updateSelectedChatId(chatId)} className="flex items-center w-full hover:bg-gray-100 hover:cursor-pointer gap-x-3">

        <img className="aspect-square w-16 rounded-full object-cover" src={avatar} />
        
        <div className="w-full">

            <div className="flex justify-between items-center">
   
                <p className="font-medium">{chatName}</p>

                <div className="flex flex-col">
                    <p  className="text-sm text-gray-500">{1}m</p>
                    { unreadMessageCount > 0 && 
                      <p className="bg-violet-500 flex items-center justify-center text-white rounded-full w-6 h-6">
                        { unreadMessageCount }
                      </p>
                    }
                </div>
            </div>
            
            <p className="text-sm text-gray-500">
              {
                latestUnreadMessage && 
               `${latestUnreadMessage.substring(0,25)}...`
              }
            </p>

        </div>

    </div>
  )
}
