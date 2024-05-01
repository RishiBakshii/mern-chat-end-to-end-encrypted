import { useGetChatsQuery } from "../api"
import { ChatList } from "./ChatList"
import { MemberList } from "./MemberList"
import { MessageList } from "../../messages/components/MessageList"
import { useAppSelector } from "../../../app/hooks"
import { selectSelectedChatId } from "../chatSlice"

export const Chat = () => {
  
  const {data:chats,isFetching} = useGetChatsQuery()
  const selectedChatId = useAppSelector(selectSelectedChatId)

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

                  <div className="flex flex-col gap-y-1">
                    <h4 className="font-medium text-4xl">Design chat</h4>
                    <p className="text-gray-500">23 members, 10 online</p>
                  </div>

                  <div className="flex items-center gap-x-5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
                  </div>

                </div>

                {/* messages area */}
                <div className="h-full flex px-2 flex-col gap-y-5 overflow-y-scroll">
                    <MessageList/>
                  
                </div>

                {/* input box */}
                <div className="flex items-center rounded-xl overflow-hidden bg-gray-200">

                    <button className="px-3 py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                    </button>

                    <input className="px-3 py-5 outline-none bg-gray-200 rounded-sm w-full" type="text" placeholder="Your message"/>
                    
                    <button className="px-3 py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                    </button>

                    <button className="px-3 py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                    </button>

                </div>
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
