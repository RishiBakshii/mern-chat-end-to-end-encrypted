import { useEffect } from "react";
import { Events } from "../enums/events";
import { useAppSelector } from "../app/hooks";
import { selectSelectedChatId } from "../features/chat/chatSlice";
import { IUserTypingEventPayloadData } from "../interfaces/messages";
import { Socket } from "socket.io-client";
import { IChatWithUnreadMessages } from "../interfaces/chat";

export const useUserTyping = (messageVal:string,socket:Socket | null,chats:Array<IChatWithUnreadMessages> | null | undefined,delay:number) => {

    const selectedChatId = useAppSelector(selectSelectedChatId)

    useEffect(()=>{
        let timeoutId:number
    
        if(messageVal.trim().length && selectedChatId){
          timeoutId = setTimeout(() => {
            
            const data:IUserTypingEventPayloadData = {
              chatId:selectedChatId,
              members:chats?.find(chat=>chat._id===selectedChatId)?.members.map(member=>member._id)! 
            }
            socket?.emit(Events.USER_TYPING,data)
          }, delay);
        }
    
        return ()=>{
          clearTimeout(timeoutId)
        }
    
      },[messageVal])
}
