import { Outlet } from "react-router-dom"
import { Navbar } from "../shared/Navbar"
import { Modal } from "../shared/Modal"
import { GroupChatForm } from "../chat/GroupChatForm"
import { AddFriendForm } from "../friends/AddFriendForm"
import { FriendRequestForm } from "../friends/FriendRequestForm"
import { ProfileForm } from "../user/ProfileForm"
import { MemberForm } from "../chat/MemberForm"
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