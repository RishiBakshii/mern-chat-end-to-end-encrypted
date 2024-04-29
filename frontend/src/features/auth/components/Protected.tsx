import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../../app/hooks"
import { selectLoggedInUser } from "../authSlice"

type propTypes = {
    children:React.ReactNode
    authorized?:boolean
}
export const Protected = ({children,authorized=true}:propTypes) => {

    const loggedInUser = useAppSelector(selectLoggedInUser)
    
    if(authorized){
        if(loggedInUser){
            return children
        }
        else{
            return <Navigate to="/login" />
        }
    }
    else if(!authorized){
        if(!loggedInUser){
            return children
        }
        else{
            return <Navigate to="/" />
        }
    }
}
