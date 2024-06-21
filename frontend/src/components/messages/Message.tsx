import { useCallback, useEffect, useState } from "react"
import { decryptMessage } from "../../utils/encryption"
import { EditMessageForm } from "./EditMessageForm"

type PropTypes = {
    sharedKey: CryptoKey | undefined
    content:string
    messageId:string
    isGroupChat:boolean
    editMessageId:string | undefined,
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const Message = ({content,sharedKey,isGroupChat,messageId,editMessageId,setEditMessageId,setOpenContextMenuMessageId}:PropTypes) => {

    const [decryptedMessage,setDecryptedMessage] = useState<string>('')
    const isMessageLong = content.length>500
    const [readMore,setReadMore] = useState<boolean>(false)

    
    useEffect(()=>{
        if(isGroupChat){
            setDecryptedMessage(content)
        }
        else if(sharedKey){
            handleDecryptMessage(sharedKey,content)
        }
    },[content,sharedKey,isGroupChat])
    
    const handleDecryptMessage = useCallback(async(sharedKey:CryptoKey,encryptedMessage:string)=>{
        const message = await decryptMessage(sharedKey,encryptedMessage)
        message?setDecryptedMessage(message):null
    },[])

    const toggleReadMore = useCallback(()=>{
        setReadMore(prev=>!prev)
    },[])

  return (

    
        editMessageId === messageId ? 
        <EditMessageForm
            messageId={messageId}
            prevContentValue={decryptedMessage}
            setEditMessageId={setEditMessageId}
            setOpenContextMenuMessageId={setOpenContextMenuMessageId}
        />
        :
        <>
        <span className="break-words max-sm:text-sm">
            {
                readMore?decryptedMessage:decryptedMessage.substring(0,400)
            }
            {
                isMessageLong && 
                <span className="font-medium cursor-pointer" onClick={toggleReadMore}>
                    {
                        readMore?" Read less":" Read more"
                    }...
                </span>
            }
        </span>
        </>
    
  )
}

