import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { INewReactionEventPayloadData } from "../../interfaces/messages"

export const useSendNewReaction = () => {

    const socket = getSocket()

    const sendNewReaction = ({chatId,messageId,reaction}:INewReactionEventPayloadData)=>{
        socket?.emit(Events.NEW_REACTION,{chatId,messageId,reaction})
    }

    return {
        sendNewReaction
    }
}
