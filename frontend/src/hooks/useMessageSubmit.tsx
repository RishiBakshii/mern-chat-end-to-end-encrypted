import { useAppSelector } from "../services/redux/store/hooks"
import { getSocket } from "../context/socket"
import { Events } from "../enums/events"
import { selectSelectedChatDetails, selectSelectedChatId } from "../services/redux/slices/chatSlice"
import { IMessageEventPayloadData } from "../interfaces/messages"

export const useMessageSubmit = () => {

    const socket = getSocket()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const submitMessageHandler = (messageVal?:string,url?:string) => {

        if(selectedChatId && selectedChatDetails){

            const data:IMessageEventPayloadData =  {
                chat:selectedChatId,
                content:messageVal?messageVal:undefined,
                url:url?url:undefined,
                members:selectedChatDetails?.members.map(member=>member._id.toString())
            }

            socket?.emit(Events.MESSAGE,data)
        }
   }

   return submitMessageHandler
}
