import { selectGifForm, setGifForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleGif = () => {

    const isGifOpen = useAppSelector(selectGifForm)
    const dispatch = useAppDispatch()

    const toggleGifForm = ()=> {
        dispatch(setGifForm(!isGifOpen))
    }

    return {
        toggleGifForm
    }
}
