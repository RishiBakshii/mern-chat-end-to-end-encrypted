import { memo, useState } from "react";
import type { IMessage } from "../../interfaces/messages";

type PropTypes = {
    isAttachment:boolean
    attachments?:Array<string>
    myMessage:boolean;
    isTextMessage:boolean
    message:IMessage,
    isGroupChat:boolean,
    url:string
}

export const MessageCard = memo(({message,myMessage=false,isGroupChat,isTextMessage,url,isAttachment,attachments}:PropTypes) => {


    const [readMore,SetReadMore] = useState<boolean>(message?.content?.length>500?true:false)
    const [isMessageBig] = useState<boolean>(message?.content?.length>500)

    const handleReadMoreOrLess = () => {
        SetReadMore(!readMore)
    }

  return (
    <div className={`flex gap-x-2 ${myMessage?"self-end":""} text-text`}>

        {
            // only shows avatar image on other's message
            !myMessage && 

            <img className="aspect-square object-cover w-12 self-start rounded-full" 
              src={message.sender.avatar} 
              alt={`${message.sender.username} avatar`} 
            />
        }
        
        <div className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} max-w-96 min-w-16 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center`}>
            
            {
                // only shows username on message when on group chat and message is of other user
                !myMessage && isGroupChat &&
                <p className="text-violet-500 font-medium">{message.sender.username}</p>
            }
            
            <p className={`justify-self-center w-full text-wrap break-words`}>
                

                {
                    isAttachment ?
                    attachments?.map(attachment=>(
                        <img src={attachment} alt="" />
                    ))
                    :
                    isTextMessage ? (

                        readMore?
                        message.content.substring(0,500):
                        message.content
                    )
                    :
                    <img src={url} alt="gif" />
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
