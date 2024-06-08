import { useGetSharedKey } from "../../hooks/useAuth/useGetSharedKey"
import { IChatMember, IChatWithUnreadMessages } from "../../interfaces/chat"
import { IMessage, IUnreadMessage } from "../../interfaces/messages"
import { ActiveDot } from "../ui/ActiveDot"
import { TypingIndicator } from "../ui/TypingIndicator"
import { useCallback, useEffect, useState } from "react"
import { decryptMessage } from "../../utils/encryption"
import { RenderAppropriateUnreadMessage } from "../messages/RenderAppropriateUnreadMessage"
import { formatRelativeTime } from "../../utils/helpers"

type PropTypes = {
  chatId:string
  chatName:string
  isGroupChat:boolean
  members:IChatWithUnreadMessages['members']
  avatar:string
  unreadMessage:IUnreadMessage
  latestMessage:IMessage
  loggedInUserId:string
  isTyping:boolean
  isMd:boolean
  selectedChatDetails:IChatWithUnreadMessages | undefined | null
  updateSelectedChatId:(chatId:string)=>void
  toggleChatBar:()=>void
  clearExtraPreviousMessages: (chatId: string) => void
}

export const ChatCard = ({chatName,isGroupChat,loggedInUserId,latestMessage,clearExtraPreviousMessages,members,selectedChatDetails,avatar,isMd,chatId,unreadMessage,isTyping,updateSelectedChatId,toggleChatBar}:PropTypes) => {
  
  const getSharedKey =  useGetSharedKey()

  const [decryptedMessage,setDecryptedMessage] = useState<string>()
  const [unreadDecryptedMessage,setUnreadDecryptedMessage] = useState<string>()

  const [sharedKey,setSharedKey] = useState<CryptoKey>()

  const otherMember = members.filter(member=>member._id!==loggedInUserId)[0]
  
  const handleSetSharedKey = useCallback(async(otherMember:IChatMember)=>{
    const key = await getSharedKey(loggedInUserId,otherMember)
    if(key){
      setSharedKey(key)
    }
  },[])

  const handleSetDecryptMessage = async(sharedKey:CryptoKey)=>{

    if(latestMessage.content?.length){
      const msg = await decryptMessage(sharedKey,latestMessage.content)
      if(msg){
        setDecryptedMessage(msg)
      }
    }
  }

  const handleSetUnreadDecryptedMessage = async(message:string)=>{
    if(sharedKey){
      const msg = await decryptMessage(sharedKey,message)
      if(msg){
        setUnreadDecryptedMessage(msg)
      }
    }
  }


  useEffect(()=>{
    if((!isGroupChat && unreadMessage?.message?.content && otherMember) || (!isGroupChat && latestMessage.content?.length)){
      handleSetSharedKey(otherMember)
    }
  },[isGroupChat,otherMember])

  useEffect(()=>{
    if(sharedKey){
      handleSetDecryptMessage(sharedKey)
    }
  },[sharedKey])

  useEffect(()=>{
    if(!isGroupChat && unreadMessage?.message?.content){
      handleSetUnreadDecryptedMessage(unreadMessage.message.content)
    }
  },[unreadMessage?.message?.content,isGroupChat])


  const handleChatCardClick = useCallback((chatId:string) =>{

    if(selectedChatDetails?._id!==chatId){
      if(selectedChatDetails){
        clearExtraPreviousMessages(selectedChatDetails._id)
      }
      updateSelectedChatId(chatId)
    }

    if(isMd){
      toggleChatBar()
    }

  },[])

  const renderOnlineStatus = () => {

    if (isGroupChat) {

      const onlineMembers = members.filter((member) => member._id !== loggedInUserId && member.isActive).length;

      return onlineMembers > 0 ? 
        <div className="text-sm text-secondary-darker flex items-center gap-x-1 ml-1">
          <ActiveDot/>
          <p>{onlineMembers}</p>
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
    <div onClick={()=>handleChatCardClick(chatId)} className={` ${selectedChatDetails?._id===chatId?"bg-secondary-dark":""}  text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3`}>

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
                
                {
                  latestMessage.createdAt && 
                  <p className="text-sm text-secondary-darker">{formatRelativeTime(new Date(latestMessage.createdAt))}</p>
                }

            </div>
            
            <div className="flex justify-between items-center">
                
                  <p className="text-sm text-secondary-darker">
                    {
                      unreadMessage.count===0?

                          // latest message display
                          isGroupChat?  // for group chat
                            RenderAppropriateUnreadMessage({
                              attachments:latestMessage.attachments?.length?true:false,
                              content:latestMessage.content,
                              poll:latestMessage.isPoll,
                              url:latestMessage.url?true:false
                            })
                          :
                          RenderAppropriateUnreadMessage({  // for private chat
                            attachments:latestMessage.attachments?.length?true:false,
                            content:decryptedMessage,
                            poll:latestMessage.isPoll,
                            url:latestMessage.url?true:false
                          })
                      :
                      // unread Message display
                      isGroupChat ?   // for group chat
                      RenderAppropriateUnreadMessage({
                        attachments:unreadMessage?.message?.attachments,
                        content:unreadMessage?.message?.content,
                        poll:unreadMessage?.message?.poll,
                        url:unreadMessage?.message?.url
                      })
                      : // for private chat
                      RenderAppropriateUnreadMessage({
                        attachments:unreadMessage?.message?.attachments,
                        content:unreadDecryptedMessage,
                        poll:unreadMessage?.message?.poll,
                        url:unreadMessage?.message?.url
                      })
                    }
                    
                    
                  </p>
                { 
                  unreadMessage?.count > 0 && 
                  <p className="bg-primary flex items-center justify-center text-white rounded-full h-5 w-5 p-2">
                    { unreadMessage?.count }
                  </p>
                }
            </div>

        </div>

    </div>
  )
}