import { Outlet } from "react-router-dom"
import { Navbar } from "../../features/navigation/components/Navbar"
import { Modal } from "../shared/Modal"
import { GroupChatForm } from "../../features/chat/components/GroupChatForm"
import { AddFriendForm } from "../../features/friends/components/AddFriendForm"
import { FriendRequestForm } from "../../features/friends/components/FriendRequestForm"
import { ProfileForm } from "../../features/user/components/ProfileForm"
import { MemberForm } from "../../features/chat/components/MemberForm"
import { selectAddFriendForm, selectFriendRequestForm, selectGroupChatForm, selectMemberForm, selectProfileForm, setAddFriendForm, setFriendRequestForm, setMemberForm, setNewgroupChatForm, setProfileForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

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

      <Modal isOpen={useAppSelector(selectAddFriendForm)} onClose={()=>dispatch(setAddFriendForm(false))}>
        <AddFriendForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectFriendRequestForm)} onClose={()=>dispatch(setFriendRequestForm(false))}>
        <FriendRequestForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectProfileForm)} onClose={()=>dispatch(setProfileForm(false))}>
        <ProfileForm/>
      </Modal>
      
      <Modal isOpen={useAppSelector(selectMemberForm)} onClose={()=>dispatch(setMemberForm(false))}>
        <MemberForm/>
      </Modal>
    </>
  )
}
