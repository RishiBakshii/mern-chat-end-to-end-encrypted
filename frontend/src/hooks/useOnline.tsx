import { Events } from "../enums/events"
import { useSocketEvent } from "./useSocketEvent"

export const useOnline = () => {

    useSocketEvent(Events.ONLINE,(userId:string)=>{
        console.log(`${userId} is online`)
      })
}
