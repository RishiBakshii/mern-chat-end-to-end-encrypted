import { ChatItem } from "./ChatItem"

export const ChatList = () => {
  return (
    <>
    <div className="flex flex-col gap-y-4 overflow-y-scroll scroll-smooth scrollbar-w-[10rem]">
        {
          Array(12).fill(0).map(_=>
            <ChatItem/>
          )
        }
    </div>
    </>

  )
}
