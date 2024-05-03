import { useEffect } from "react"
import toast from "react-hot-toast"
import { isErrorWithMessage } from "../utils/helpers"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"

type PropTypes = {
    isLoading:boolean,
    isUninitialized:boolean,
    isSuccess:boolean,
    isError:boolean,
    error:FetchBaseQueryError | SerializedError | undefined
}
export const useToast = ({error,isError,isLoading,isSuccess,isUninitialized}:PropTypes) => {

    useEffect(()=>{
        if(!isUninitialized){

            if(isLoading){
                toast.loading("loading")
            }

            if(!isLoading && !isSuccess && isError){
                toast.dismiss()
                if(isErrorWithMessage(error)){
                    toast.error(error.data.message)
                }else{
                    toast.error("some Error occured")
                }
            }

            if(!isLoading && isSuccess && !isError){
                toast.dismiss()
                toast.success("success")
            }

        }
    },[isLoading,isUninitialized,isSuccess])
}
