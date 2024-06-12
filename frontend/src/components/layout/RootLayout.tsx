import { Outlet } from "react-router-dom"
import {
  resetAttachments,
  selectAddFriendForm,
  selectAddMemberForm,
  selectAttachments,
  selectCallInForm,
  selectCallInRequestDisplay,
  selectChatUpdateForm,
  selectFriendRequestForm,
  selectGifForm,
  selectGroupChatForm,
  selectNotificationPermissionForm,
  selectPollForm,
  selectProfileForm,
  selectRemoveMemberForm,
  selectSettingsForm,
  selectViewVotes,
  setAddFriendForm,
  setAddMemberForm,
  setCallInForm,
  setCallInRequestDisplay,
  setChatUpdateForm,
  setFriendRequestForm,
  setGifForm,
  setNewgroupChatForm,
  setNotificationPermissionForm,
  setPollForm,
  setProfileForm,
  setRemoveMemberForm,
  setSettingsForm,
  setViewVotes
} from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { CallInForm } from "../callIn/CallInForm"
import { CallInRequestDisplay } from "../callIn/CallInRequestDisplay"
import { ChatUpdateForm } from "../chat/ChatUpdateForm"
import { GroupChatForm } from "../chat/GroupChatForm"
import { TenorGifForm } from "../chat/TenorGifForm"
import { AddFriendForm } from "../friends/AddFriendForm"
import { FriendRequestForm } from "../friends/FriendRequestForm"
import { AddMemberForm } from "../member/AddMemberForm"
import { RemoveMemberForm } from "../member/RemoveMemberForm"
import { PollForm } from "../messages/PollForm"
import { ViewVotes } from "../messages/ViewVotes"
import { Navbar } from "../navbar/Navbar"
import { Modal } from "../shared/Modal"
import { AttachmentPreview } from "../ui/AttachmentPreview"
import { ProfileForm } from "../user/ProfileForm"
import { SettingsForm } from "../user/SettingsForm"
import { NotificationPermissionForm } from "../user/NotificationPermissionForm"

export const RootLayout = () => {

  const dispatch = useAppDispatch()

  return (
    <>

    <header>
        <Navbar/>
    </header>
    <main className="h-[calc(100vh-3.5rem)]">
        <Outlet/>
    </main>

      <Modal isOpen={useAppSelector(selectGroupChatForm)} onClose={()=>dispatch(setNewgroupChatForm(false))}>
        <GroupChatForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectAddMemberForm)} onClose={()=>dispatch(setAddMemberForm(false))}>
        <AddMemberForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectAddFriendForm)} onClose={()=>dispatch(setAddFriendForm(false))}>
        <AddFriendForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectFriendRequestForm)} onClose={()=>dispatch(setFriendRequestForm(false))}>
        <FriendRequestForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectProfileForm)} onClose={()=>dispatch(setProfileForm(false))}>
        <ProfileForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectRemoveMemberForm)} onClose={()=>dispatch(setRemoveMemberForm(false))}>
        <RemoveMemberForm/>
      </Modal>
      
      <Modal isOpen={useAppSelector(selectGifForm)} onClose={()=>dispatch(setGifForm(false))}>
        <TenorGifForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectAttachments).length>0} onClose={()=>dispatch(resetAttachments())}>
        <AttachmentPreview/>
      </Modal>

      <Modal isOpen={useAppSelector(selectPollForm)} onClose={()=>dispatch(setPollForm(false))}>
        <PollForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectViewVotes)} onClose={()=>dispatch(setViewVotes(false))}>
        <ViewVotes/>
      </Modal>

      <Modal isOpen={useAppSelector(selectChatUpdateForm)} onClose={()=>dispatch(setChatUpdateForm(false))}>
        <ChatUpdateForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectCallInForm)} onClose={()=>dispatch(setCallInForm(false))}>
        <CallInForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectCallInRequestDisplay)} onClose={()=>dispatch(setCallInRequestDisplay(false))}>
        <CallInRequestDisplay/>
      </Modal>

      <Modal isOpen={useAppSelector(selectSettingsForm)} onClose={()=>dispatch(setSettingsForm(false))}>
        <SettingsForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectNotificationPermissionForm)} onClose={()=>dispatch(setNotificationPermissionForm(false))}>
        <NotificationPermissionForm/>
      </Modal>
    </>
  )
}
