import { chatApi } from "../../services/api/chatApi"
import { removeSpectators } from "../../services/redux/slices/chatSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useDispatchRemoveSpectatorById = () => {

    const dispatch = useAppDispatch()

    return ({spectatorChatId,spectatorId}:{spectatorChatId:string,spectatorId:string})=>{

        dispatch(removeSpectators({spectatorId}))

        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
              
              const chat = draft.find(draft=>draft._id===spectatorChatId)
    
              if(chat){
                chat.spectators = chat.spectators.filter(spectator=>spectator._id!==spectatorId)
              }
            })
          )
    }
}
