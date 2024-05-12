import { memo, useState } from "react";
import type { IMessage } from "../../interfaces/messages";

type PropTypes = {
    myMessage:boolean;
    message:IMessage,
    isGroupChat:boolean
}

export const MessageItem = memo(({message,myMessage=false,isGroupChat}:PropTypes) => {


    const [readMore,SetReadMore] = useState<boolean>(message.content.length>500?true:false)
    const [isMessageBig] = useState<boolean>(message.content.length>500)

    const handleReadMoreOrLess = () => {
        SetReadMore(!readMore)
    }

  return (
    <div className={`flex gap-x-2 ${myMessage?"self-end":""}`}>

        {
            !myMessage && 

            <img className="aspect-square object-cover w-12 self-start rounded-full" 
              src={message.sender.avatar} 
              alt={`${message.sender.username} avatar`} 
            />
        }
        
        <div className={`${myMessage?"bg-violet-500 text-white":"bg-gray-100"} max-w-96 min-w-16 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center`}>
            
            {
                !myMessage && isGroupChat &&
                <p className="text-violet-500 font-medium">{message.sender.username}</p>
            }
            
            <p className="justify-self-center w-full text-wrap break-words">

                {
                    readMore?
                    message.content.substring(0,500):
                    message.content
                }
                {
                    isMessageBig && 
                    <span 
                        className="font-medium" 
                        onClick={handleReadMoreOrLess}>
                        {readMore?" read more...":" read less"}
                    </span>
                }
            </p>
        </div>
    </div>
  )
})
