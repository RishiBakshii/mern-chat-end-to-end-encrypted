import { chatApi } from "../../services/api/chatApi"

export const useTypingTimeout = (userId:string,chatId:string,duration=1000) => {

    return ()=>{

        const timeout = setTimeout(()=>{

            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{

                const chat = draft.find(draft=>draft._id===chatId)

                if(chat){
                    alert("removed from typings")
                    chat.userTyping = chat.userTyping.filter(user=>user._id!==userId)
                }
            })


        },duration)
    }


}
