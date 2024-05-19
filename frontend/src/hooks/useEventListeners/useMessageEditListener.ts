import { Events } from "../../enums/events"
import { IEditMessageEventReceiveData } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageEditListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE_EDIT,({_id,chat,content,isEdited}:IEditMessageEventReceiveData)=>{

        dispatch(
            messageApi.util.updateQueryData("getMessagesByChatId",chat,(draft)=>{

                const msg = draft.find(draft=>draft._id===_id)

                if(msg){

                    msg.isEdited=isEdited
                    msg.content=content
                }

            })
        )
    })
}
