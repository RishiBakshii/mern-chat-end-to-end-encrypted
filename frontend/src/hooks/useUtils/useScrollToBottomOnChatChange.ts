import { useEffect } from "react"

export const useScrollToBottomOnChatChange = (ref:React.RefObject<HTMLDivElement>,deps:Array<any>) => {

    useEffect(()=>{
        const container = ref.current

        if(container){
            container.scrollTop = container.scrollHeight
        }

    },[...deps])
}
