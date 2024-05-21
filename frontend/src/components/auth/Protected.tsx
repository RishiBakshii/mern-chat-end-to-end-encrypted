import { Navigate } from "react-router-dom"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

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
            return <Navigate to="/auth/login" />
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
