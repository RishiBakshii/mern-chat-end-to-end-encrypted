import { Navigate, useLocation } from "react-router-dom"
import { IUser } from "../../interfaces/auth"

type propTypes = {
    loggedInUser:IUser | null
    children:React.ReactNode
    authorized?:boolean
}
export const Protected = ({loggedInUser,children,authorized=true}:propTypes) => {

    const location  = useLocation()

    if(authorized){

        if(loggedInUser && loggedInUser.verified){
            return children
        }

        else if(loggedInUser && !loggedInUser.verified){

            if (location.pathname === "/auth/verification") {
                return children
            } 
            else {
                return <Navigate to="/auth/verification" />;
            }
        }
        
        return <Navigate to="/auth/login" />
        
    }
    else if(!authorized){

        if(!loggedInUser){
            return children
        }
        
        return <Navigate to="/" />
        
    }
}
