import { getSocket } from "../../context/socket";
import { Events } from "../../enums/events";

export const useRejectCallInRequest = () => {

  const socket = getSocket();

  return (callerId:string) => {
    socket?.emit(Events.CALL_IN_REJECT, callerId);
  }

}
