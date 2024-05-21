import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useHandleNavigate = (to:string,dependency:boolean | unknown) => {

    const navigate = useNavigate()

    useEffect(()=>{
        if(dependency){
            navigate(to)
        }
    },[dependency])
}
