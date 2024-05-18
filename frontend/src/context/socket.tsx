import { createContext, useContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { config } from "../config/envConfig";
import { useAppSelector } from "../services/redux/store/hooks";
import { selectLoggedInUser } from "../services/redux/slices/authSlice";

const socketContext =  createContext<Socket | null>(null)

type PropTypes = {
    children:React.ReactNode
}

export const getSocket = ()=> useContext(socketContext)

export const SocketProvider = ({children}:PropTypes) => {

    const loggedInUser = useAppSelector(selectLoggedInUser)

    const socket = useMemo(()=>{
        
        if(loggedInUser){
            return io(config.absolute_base_url,{withCredentials:true})
        }
        return null
    },[loggedInUser])

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}
