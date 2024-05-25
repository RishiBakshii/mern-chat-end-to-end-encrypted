import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IMessageEventPayloadData } from "../../interfaces/messages"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"


export const useSendMessage = () => {

    const socket = getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    
    return (messageVal?:string,url?:string,pollQuestion?:string,pollOptions?:Array<string>)=>{

        if(selectedChatDetails && (messageVal || url || pollOptions || pollQuestion)){
    
            const newMessage:IMessageEventPayloadData =  
            {
                chat:selectedChatDetails._id,
                content:messageVal?messageVal:undefined,
                url:url?url:undefined,
                isPoll:(pollOptions?.length && pollQuestion?.length)?true:undefined,
                pollOptions:pollOptions?.map(option=>{
                    return {option,votes:[]}
                }),
                pollQuestion,
                members:selectedChatDetails?.members.map(member=>member._id.toString())
            }
            socket?.emit(Events.MESSAGE,newMessage)
        }
    }
}
