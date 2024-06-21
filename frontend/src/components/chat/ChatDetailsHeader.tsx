import { useToggleChatUpdateForm } from "../../hooks/useUI/useToggleChatUpdateForm"
import { Avatar } from "../ui/Avatar"
import { LockIcon } from "../ui/icons/LockIcon"

type PropTypes = {
    isAdmin:boolean
    avatar:string
    isGroupChat:boolean
    chatName:string
    membersLength:number
}

export const ChatDetailsHeader = ({avatar,chatName,membersLength,isAdmin,isGroupChat}:PropTypes) => {

  const toggleChatUpdateForm = useToggleChatUpdateForm()


  return (

    <>
      <div className="flex items-center gap-x-2">

          <h5 className="font-medium text-xl text-fluid-h5">Chat Details</h5>

          {
            isAdmin && 
            <button onClick={toggleChatUpdateForm}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
          }

      </div>

      <div className="relative">

        <Avatar
            alt="chat avatar"
            imgUrl={avatar}
            width={20}
            height={20}
        />

      </div>

      <div className="flex flex-col justify-center items-center">
            <h4 className="text-lg font-medium">{chatName}</h4>

            {
              isGroupChat && 
              <p className="text-secondary-darker">{membersLength} members</p>
            }

            {
              !isGroupChat && 
              <div className="flex items-center gap-x-1">
                  <p className="text-secondary-darker">End to end encrypted</p>
                  <LockIcon/>
              </div>
            }
      </div>
    
    </>
  )
}
