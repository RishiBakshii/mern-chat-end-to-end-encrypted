import { selectPollForm, setPollForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useTogglePoolForm = () => {

    const dispatch = useAppDispatch()
    const pollForm = useAppSelector(selectPollForm)

    const togglePollForm = ()=>{
        dispatch(setPollForm(!pollForm))
    }

    return {
        togglePollForm
    }
}
