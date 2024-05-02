import { useEffect } from "react"
import { Events } from "../enums/events"
import { getSocket } from "../context/socket"
import { useAppSelector } from "../app/hooks"
import { selectSelectedChatId } from "../features/chat/chatSlice"

export const useSocketEvent = (eventName:Events,callback:any) => {

    const socket = getSocket()
    const selectedChatId = useAppSelector(selectSelectedChatId)

    useEffect(()=>{
        if(socket){
          socket.on(eventName,callback)
        }
    
        return ()=>{
          socket?.off(eventName,callback)
        }
      },[socket,selectedChatId])
}
