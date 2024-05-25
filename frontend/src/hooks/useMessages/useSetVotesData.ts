import { IMessage } from "../../interfaces/messages"
import { setVotesData } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useSetVotesData = () => {


    const dispatch = useAppDispatch()

    return (voteData:Pick<IMessage, 'pollQuestion' | 'pollOptions'>)=>dispatch(setVotesData(voteData))
}
