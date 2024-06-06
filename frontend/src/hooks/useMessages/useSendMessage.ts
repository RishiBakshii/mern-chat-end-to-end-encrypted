import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IMessageEventPayloadData } from "../../interfaces/messages"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { encryptMessage } from "../../utils/encryption"
import { useGetSharedKey } from "../useAuth/useGetSharedKey"


export const useSendMessage = () => {

    const socket = getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id
    const getSharedKey = useGetSharedKey()
    
    return async(messageVal?:string,url?:string,pollQuestion?:string,pollOptions?:Array<string>,isMultipleAnswers?:boolean)=>{


        let encryptedMessage;

        if(messageVal && loggedInUserId && !selectedChatDetails?.isGroupChat && selectedChatDetails){

            const otherMember = selectedChatDetails.members.filter(member=>member._id!==loggedInUserId)[0]
            const sharedSecretKey = await getSharedKey(loggedInUserId,otherMember)

            if(sharedSecretKey){
                encryptedMessage = await encryptMessage(sharedSecretKey,messageVal)
            }
        }

        if(selectedChatDetails && (messageVal || url || pollOptions || pollQuestion || isMultipleAnswers)){
            
            const newMessage:IMessageEventPayloadData =  
            {
                chat:selectedChatDetails._id,
                content:encryptedMessage?encryptedMessage:messageVal?messageVal:undefined,
                url:url?url:undefined,
                isPoll:(pollOptions?.length && pollQuestion?.length)?true:undefined,
                pollOptions:pollOptions?.map(option=>{
                    return {option,votes:[]}
                }),
                pollQuestion,
                isMultipleAnswers
            }
            socket?.emit(Events.MESSAGE,newMessage)
        }
    }
}
