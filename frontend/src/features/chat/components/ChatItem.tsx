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

        {
          chat.isGroupChat ?

          <div className="flex item-center rounded-full w-16">
            {
              chat.members.map(member=>(
                <img className="rounded-md object-cover h-4 w-4" 
                src={member.avatar} alt={member.username}/>
              ))
            }
          </div> 
          :
          <img className="aspect-square w-16 rounded-md object-cover"
          src={chat.members.filter(member=>member._id!==loggedInUser?._id)[0].avatar}
          />
        }

        <div className="w-full">
            <div className="flex justify-between items-center">
                <p className="font-medium">{chat.isGroupChat?`${chat.name?.substring(0,20)}..`:chat.members.filter(member=>member._id!==loggedInUser?._id)[0].username}</p>
                <div className="flex flex-col">
                  <p  className="text-sm text-gray-500">{1}m</p>
                  {
                    chat.unreadMessages.count>0 && 
                    <p className="bg-violet-500 flex items-center justify-center text-white rounded-full w-6 h-6">
                      {chat.unreadMessages.count}
                    </p>
                  }
                    
                  
                </div>
            </div>
            <p className="text-sm text-gray-500">
              {
                chat.unreadMessages.message.content && 
               `${chat.unreadMessages.message.content?.substring(0,25)}...`
              }
            </p>
        </div>

    </div>
  )
}
