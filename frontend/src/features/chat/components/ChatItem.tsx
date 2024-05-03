import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { IChatWithUnreadMessages } from "../../../interfaces/chat"
import { selectLoggedInUser } from "../../auth/authSlice"
import { updateSelectedChatId } from "../chatSlice"

type PropTypes = {
  chat:IChatWithUnreadMessages
}
export const ChatItem = ({chat}:PropTypes) => {

  const dispatch = useAppDispatch()

  const handleChangeSelectedChat = (id:string) => {
    dispatch(updateSelectedChatId(id))
  }
  const loggedInUser = useAppSelector(selectLoggedInUser)

  return (
    <div onClick={()=>handleChangeSelectedChat(chat._id)} className="flex items-center w-full hover:bg-gray-100 hover:cursor-pointer gap-x-3">

        {/* chat avatar */}
        {
          chat.isGroupChat ? 
          <img className="aspect-square w-16 rounded-md object-cover" src={chat.avatar} />
          :
          <img className="aspect-square w-16 rounded-md object-cover" src={chat.members.filter(member=>member._id!==loggedInUser?._id)[0].avatar} />
        }
        
        <div className="w-full">

            <div className="flex justify-between items-center">
              {/* chat name */}
                <p className="font-medium">{chat.isGroupChat?`${chat.name?.substring(0,20)}..`:chat.members.filter(member=>member._id!==loggedInUser?._id)[0].username}</p>
                {/*last mesage time and unread mesage count */}
                <div className="flex flex-col">
                    <p  className="text-sm text-gray-500">{1}m</p>
                    {chat.unreadMessages.count>0 && 
                      <p className="bg-violet-500 flex items-center justify-center text-white rounded-full w-6 h-6">
                        {chat.unreadMessages.count}
                      </p>
                    }
                </div>
            </div>
            
            {/* latest unread message */}
            <p className="text-sm text-gray-500">
              {
                chat.unreadMessages.message.content && 
               `${chat.unreadMessages.message.content.substring(0,25)}...`
              }
            </p>

        </div>

    </div>
  )
}
