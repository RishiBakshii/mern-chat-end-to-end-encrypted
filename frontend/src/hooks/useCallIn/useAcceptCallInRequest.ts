import { getSocket } from "../../context/socket";
import { Events } from "../../enums/events";
import { ICallAcceptEventPayloadData } from "../../interfaces/callIn";

export const useAcceptCallInRequest = () => {

    const socket = getSocket();

    return ({callerId,chat}:ICallAcceptEventPayloadData) => {

        socket?.emit(Events.CALL_IN_ACCEPT, {callerId,chat});
    };
};
