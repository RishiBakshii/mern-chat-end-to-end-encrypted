import { Events } from '../../enums/events';
import { IJoinedChat } from '../../interfaces/callIn';
import { setJoinedChats } from '../../services/redux/slices/uiSlice';
import { useAppDispatch } from '../../services/redux/store/hooks';
import { useSocketEvent } from '../useSocket/useSocketEvent';

export const useCallInAcceptListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.CALL_IN_ACCEPT, (joinedChat:IJoinedChat) => {
        dispatch(setJoinedChats(joinedChat))
    }
    )
};
