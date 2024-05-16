import { Events } from "../../enums/events"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useOnlineListener = () => {

    useSocketEvent(Events.ONLINE,(userId:string)=>{
        console.log(`${userId} is online`)
      })
}
