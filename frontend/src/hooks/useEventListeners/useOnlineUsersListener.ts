import { Events } from "../../enums/events";
import { chatApi } from "../../services/api/chatApi";
import { friendApi } from "../../services/api/friendApi";
import { useAppDispatch } from "../../services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useOnlineUsersListener = () => {

  const dispatch = useAppDispatch();

  useSocketEvent(Events.ONLINE_USERS, (onlineUserIds:Array<string>) => {
    
    dispatch(
      friendApi.util.updateQueryData('getFriends', undefined, (draft) => {
        draft.forEach((friend) => {
          friend.isActive = onlineUserIds.includes(friend._id);
        });
      })
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.forEach((chat) => {
          chat.members.forEach((member) => {
            member.isActive = onlineUserIds.includes(member._id);
          });
        });
      })
    );
  });
};
