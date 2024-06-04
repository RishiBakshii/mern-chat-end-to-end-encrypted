import { useEffect } from "react"
import { initializeIndexDb } from "../../utils/indexedDB"

export const useInitializeIndexDb = () => {
    
    useEffect(()=>{
        initializeIndexDb()
    },[])
}
