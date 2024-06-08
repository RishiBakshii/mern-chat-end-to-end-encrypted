import { useEffect, useState } from "react"
import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery"
import { ICallOutEventPayloadData } from "../../interfaces/callIn"
import { IChatWithUnreadMessages, ISpectator } from "../../interfaces/chat"
import { formatRelativeTime } from "../../utils/helpers"
import { ActiveDot } from "../ui/ActiveDot"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
  handleCallOut: (payload: ICallOutEventPayloadData) => void
  selectedChatName:string
  loggedInUserId:string
  totalMembers:number
  chatName:string
  chatAvatar:string
  isGroupChat:boolean
  spectators:Array<ISpectator>
  lastSeen:Date | null
  selectedChatDetails:IChatWithUnreadMessages
  toggleChatDetailsBar: () => void
}

export const ChatHeader = ({loggedInUserId,totalMembers,selectedChatDetails,lastSeen,chatName,chatAvatar,isGroupChat,spectators,toggleChatDetailsBar}:PropTypes) => {
  
  const is2xl = useMediaQuery(1536)

  const [onlineUsers,setOnlineUsers] = useState<number>(0)
  console.log(selectedChatDetails);
  
  useEffect(()=>{
    if(isGroupChat){
      setOnlineUsers(selectedChatDetails.members.filter(member=>member._id!==loggedInUserId && member.isActive).length)
    }
    else{
      console.log(selectedChatDetails.members.filter(member=>member._id!==loggedInUserId));
      setOnlineUsers(selectedChatDetails.members.filter(member=>member._id!==loggedInUserId)[0].isActive ? 1 : 0)
    }
  },[isGroupChat])


  return (
    <div className="flex items-center justify-between text-text bg-background">

        <div onClick={()=>is2xl?toggleChatDetailsBar():""} className="flex flex-col gap-y-1">

          <div className="flex gap-x-3">
              <Avatar imgUrl={chatAvatar} height={14} width={14} alt={`${chatName} avatar`} />

              <div className="flex flex-col gap-y-1">

                  <div className="flex flex-col gap-y-1">
                      <h4 className="font-medium text-4xl text-fluid-h4">{chatName}</h4>

                      <div className="flex items-center gap-x-2">
                        {
                          !isGroupChat && lastSeen && 
                          <p className="text-secondary-darker">last seen {formatRelativeTime(lastSeen)}</p>
                        }
                        
                        {
                          onlineUsers>0 ?
                            isGroupChat ? 
                              <div className="flex items-center gap-x-2">
                                <ActiveDot/>
                                <p>{onlineUsers} {onlineUsers===1?"member":"members"}</p>
                              </div>
                              :
                              <div className="flex items-center gap-x-2">
                                <ActiveDot/>
                                <p className="text-secondary-darker">Active</p>
                              </div>
                          :
                          null
                        }

                      </div>
                  </div>
                  {
                    isGroupChat && 
                    <p className="text-secondary-darker text-fluid-p">{totalMembers} Members</p>
                  }
              </div>
          </div>

          <div className="flex items-center gap-x-4">
              {
                spectators?.length>0 &&
                <div className="flex items-center gap-x-2">
                    <p className="text-secondary-darker">Spectators</p>

                    <div className="flex items-center">
                      {
                        spectators.map(spec=>(
                          <div key={spec._id} className="relative">
                            <Avatar imgUrl={spec.avatar} alt={spec.username} width={6} height={6}/>
                            {
                              spec.callerId === loggedInUserId && 

                                <svg onClick={()=>{
                                  // handleCallOut({
                                  //   callee:{_id:spec._id,avatar:spec.avatar,username:spec.username},
                                  //   chat:{chatId:spec.chatId,name:selectedChatName}
                                  // })
                                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            }
                          </div>
                        ))
                      }
                    </div>
                </div>
              }
          </div>
        
        </div>

        
    </div>

  )
}
