import { useEffect } from "react"
import { Events } from "../../enums/events"
import { getSocket } from "../../context/socket"
import { useAppSelector } from "../../services/redux/store/hooks"
import { selectSelectedChatDetails, selectSelectedChatId } from "../../services/redux/slices/chatSlice"

export const useSocketEvent = (eventName:Events,callback:any) => {

    const socket = getSocket()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useEffect(()=>{
        if(socket){
          socket.on(eventName,callback)
        }
    
        return ()=>{
          socket?.off(eventName,callback)
        }
      },[socket,selectedChatId,selectedChatDetails])
}
