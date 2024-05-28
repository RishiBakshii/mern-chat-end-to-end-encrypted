import { selectChatUpdateForm, setChatUpdateForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleChatUpdateForm = () => {

  const dispatch = useAppDispatch()
  const chatUpdateForm = useAppSelector(selectChatUpdateForm)

  return ()=>{
    dispatch(setChatUpdateForm(!chatUpdateForm))
  }

}
