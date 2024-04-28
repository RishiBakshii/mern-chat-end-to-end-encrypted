import { Navigate } from "react-router-dom"
import { useCheckAuthQuery } from "../api"

type propTypes = {
    children:React.ReactNode
}
export const Protected = ({children}:propTypes) => {

    const {isSuccess} = useCheckAuthQuery()

    if(isSuccess){
        return children
    }

    return <Navigate to={'/login'} replace/>
}
