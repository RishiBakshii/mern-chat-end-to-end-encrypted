import { useEffect } from "react";
import { useAppSelector } from "../services/redux/store/hooks"
import { getSocket } from "../context/socket";
import { Events } from "../enums/events";
import { selectSelectedChatDetails, selectSelectedChatId } from "../services/redux/slices/chatSlice";
import { IUserTypingEventPayloadData } from "../interfaces/messages";

export const useUserTyping = (messageVal:string,delay:number) => {

    const socket = getSocket()


    const selectedChatId = useAppSelector(selectSelectedChatId)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useEffect(()=>{
        let timeoutId:number
    
        if(messageVal.trim().length && selectedChatId){
          timeoutId = setTimeout(() => {
            
            const data:IUserTypingEventPayloadData = {
              chatId:selectedChatId,
              members:selectedChatDetails?.members.map(member=>member._id)! 
            }
            socket?.emit(Events.USER_TYPING,data)
          }, delay);
        }
    
        return ()=>{
          clearTimeout(timeoutId)
        }
    
      },[messageVal])
}
