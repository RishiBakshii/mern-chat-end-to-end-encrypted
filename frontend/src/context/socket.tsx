import { createContext, useContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { config } from "../config/envConfig";

const socketContext =  createContext<Socket | null>(null)

type PropTypes = {
    children:React.ReactNode
}

export const getSocket = ()=> useContext(socketContext)
export const SocketProvider = ({children}:PropTypes) => {

    const socket = useMemo(()=>io(config.absolute_base_url,{withCredentials:true}),[])

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}
