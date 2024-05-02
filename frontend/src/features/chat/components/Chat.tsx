import { chatApi, useGetChatsQuery } from "../api"
import { ChatList } from "./ChatList"
import { MemberList } from "./MemberList"
import { MessageList } from "../../messages/components/MessageList"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectSelectedChatId } from "../chatSlice"
import { useEffect, useState } from "react"
import { messageApi, useLazyGetMessagesByChatIdQuery } from "../../messages/api"
import { ChatDetails } from "./ChatDetails"
import { Events } from "../../../enums/events"
import type { IMessage, IMessageEventPayloadData, IMessageSeenEventPayloadData, IMessageSeenEventReceiveData, IUnreadMessageEventReceiveData, IUserTypingEventPayloadData } from "../../../interfaces/messages"
import { selectLoggedInUser } from "../../auth/authSlice"
import { useSocketEvent } from "../../../hooks/useSocketEvent"
import { getSocket } from "../../../context/socket"
import { SeenByList } from "./SeenByList"
import { useUpdateUnreadMessage } from "../../../hooks/useUpdateUnreadMessage"
import { useUserTyping } from "../../../hooks/useUserTyping"

export const Chat = () => {
  
  const dispatch = useAppDispatch()

  const selectedChatId = useAppSelector(selectSelectedChatId)
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const {data:chats,isFetching}= useGetChatsQuery()
  const [getMessagesByChatIdQueryTrigger,{data,isFetching:isMessagesFetching}]=useLazyGetMessagesByChatIdQuery()

  const [messageVal,setMessageVal]=useState<string>('')
  
  const socket = getSocket()
  
  useUpdateUnreadMessage()
  useSocketEvent(Events.MESSAGE,(newMessage:IMessage)=>{
    if(selectedChatId){
      dispatch(
        messageApi.util.updateQueryData('getMessagesByChatId',selectedChatId,(draft)=>{
          draft.push(newMessage)
        })
      )
    }
  })

  useSocketEvent(Events.UNREAD_MESSAGE,(data:IUnreadMessageEventReceiveData)=>{

    if(data.chatId === selectedChatId){

      const payload:IMessageSeenEventPayloadData =  {
        chatId:selectedChatId,
        members:chats?.find(chat=>chat._id===selectedChatId)?.members.map(member=>member._id)!
      }

      socket?.emit(Events.MESSAGE_SEEN,payload)
    }
    else{
      dispatch(
        chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
  
          const chat = draft.find(draft=>draft._id===data.chatId)
  
          if(chat){
            chat.unreadMessages.count++
            chat.unreadMessages.message = data.message
            chat.unreadMessages.sender = data.sender
          }
          
        })
      )
    }

  })

  useSocketEvent(Events.MESSAGE_SEEN,(seenMessageDetails:IMessageSeenEventReceiveData)=>{
    if(seenMessageDetails.user._id === loggedInUser?._id){
      dispatch(
        chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
          const chat = draft.find(chat=>chat._id===seenMessageDetails.chat)
  
          if(chat){
            chat.unreadMessages.count=0
          }
        })
      )
    }
    else{
      dispatch(
        chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
          const chat = draft.find(chat=>chat._id===seenMessageDetails.chat)
  
          if(chat){
            console.log('pushed brotherrrrr');
            chat.seenBy?.push(seenMessageDetails.user)
          }
        })
      )
    }
  })
  
  useUserTyping(messageVal,socket,chats,300)

  const sendMessage = (e:React.FormEvent)=>{

    e.preventDefault()

    if(selectedChatId){

      const data:IMessageEventPayloadData =  {
        chat:selectedChatId,
        content:messageVal,
        members:chats?.find(chat=>chat._id===selectedChatId)?.members.map(member=>member._id)!
      }
      socket?.emit(Events.MESSAGE,data)
      setMessageVal('')

    }

  }

  useEffect(()=>{
    if(selectedChatId){
      getMessagesByChatIdQueryTrigger(selectedChatId,true)
    }
  },[selectedChatId])


  return (
    <div className="flex w-screen h-full">
      
      {/* left */}
      <div className="flex-[.5] p-6 flex flex-col gap-y-4">

          {/* search input */}
          <div className="flex items-center bg-gray-200 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input className="outline-none bg-inherit rounded-sm w-full  px-3 py-3" type="text" placeholder="Search"/>
          </div>
          {
            !isFetching && chats && <ChatList chats={chats}/>
          }
         
      </div>

      {/* middle */}
      <div className="flex-[1.6] p-6 flex flex-col justify-between gap-y-4">
          {
            !isFetching && chats && selectedChatId ?

              <>
                {/* chat name,info and options */}
                <div className="flex flex-row justify-between items-center">
                  {
                    !isFetching && chats && selectedChatId &&  
                    <ChatDetails chat={chats.find(chat=>chat._id===selectedChatId)!} />
                  }
                </div>

                {/* messages area */}
                <div className="h-full flex px-2 flex-col gap-y-5 overflow-y-scroll">
                  {
                    !isMessagesFetching && data && <MessageList messages={data} loggedInUserId={loggedInUser?._id!}/>
                  }
                  { 
                    selectedChatId && 
                    <SeenByList members={chats.find(chat=>chat._id===selectedChatId)?.seenBy!}/>  
                  }
                </div>

                {/* input box */}
                <form onSubmit={sendMessage} className="flex items-center rounded-xl overflow-hidden bg-gray-200">

                    <button className="px-3 py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                    </button>

                    <input value={messageVal} onChange={(e)=>setMessageVal(e.target.value)} className="px-3 py-5 outline-none bg-gray-200 rounded-sm w-full" type="text" placeholder="Your message"/>
                    
                    <button className="px-3 py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                    </button>
                    {
                      messageVal?.trim().length>0 && 
                      <button type="submit" className="px-3 py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                      </button>
                    }

                </form>
              </>
              :
              <h4 className="mx-auto text-xl">Select a chat to start a conversation</h4>

          }

      </div>

      {/* right (member list) */}
      <div className="flex-[.8] flex flex-col justify-between p-6">

          <div className="flex flex-col gap-y-4 overflow-y-scroll scroll-smooth">

            {
              !isFetching && chats && selectedChatId &&
              <>
              <h6 className="text-xl font-medium">{chats?.find(chat=>chat._id===selectedChatId)?.members.length} Members</h6>
              <MemberList members={chats.find(chat=>chat._id===selectedChatId)?.members}/>
              </>
            }
          </div>
      </div>

    </div>
  )
}
