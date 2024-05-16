import { Events } from "../../enums/events"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useOfflineListener = () => {

    useSocketEvent(Events.OFFLINE,(userId:string)=>{
        console.log(`${userId} is offline`)
      })
}
