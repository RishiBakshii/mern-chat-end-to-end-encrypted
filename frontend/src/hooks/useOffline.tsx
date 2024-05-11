import { Events } from "../enums/events"
import { useSocketEvent } from "./useSocketEvent"

export const useOffline = () => {

    useSocketEvent(Events.OFFLINE,(userId:string)=>{
        console.log(`${userId} is offline`)
      })
}
