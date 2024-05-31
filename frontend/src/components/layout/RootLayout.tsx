import { motion } from 'framer-motion'
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
  selectJoinedChats,
  selectPollForm,
  selectProfileForm,
  selectRemoveMemberForm,
  selectViewVotes,
  selectactiveJoinedChat,
  setAddFriendForm,
  setAddMemberForm,
  setCallInForm,
  setCallInRequestDisplay,
  setChatUpdateForm,
  setFriendRequestForm,
  setGifForm,
  setNewgroupChatForm,
  setPollForm,
  setProfileForm,
  setRemoveMemberForm,
  setViewVotes,
  setactiveJoinedChat
} from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { CallInForm } from "../callIn/CallInForm"
import { CallInRequestDisplay } from "../callIn/CallInRequestDisplay"
import { ChatUpdateForm } from "../chat/ChatUpdateForm"
import { GroupChatForm } from "../chat/GroupChatForm"
import { TenorGifForm } from "../chat/TenorGifForm"
import { AddFriendForm } from "../friends/AddFriendForm"
import { FriendRequestForm } from "../friends/FriendRequestForm"
import { JoinedChatFloatingList } from '../joinedChats/JoinedChatFloatingList'
import { AddMemberForm } from "../member/AddMemberForm"
import { RemoveMemberForm } from "../member/RemoveMemberForm"
import { PollForm } from "../messages/PollForm"
import { RenderAppropriateMessage } from '../messages/RenderAppropriateMessage'
import { ViewVotes } from "../messages/ViewVotes"
import { Navbar } from "../navbar/Navbar"
import { Modal } from "../shared/Modal"
import { AttachmentPreview } from "../ui/AttachmentPreview"
import { Avatar } from "../ui/Avatar"
import { ProfileForm } from "../user/ProfileForm"

export const RootLayout = () => {

  const dispatch = useAppDispatch()
  const joinedChats = useAppSelector(selectJoinedChats)
  const activeJoinedChat = useAppSelector(selectactiveJoinedChat)

  const toggleJoinedChatOpenClose = (chatId:string)=>{
    activeJoinedChat?dispatch(setactiveJoinedChat('')):dispatch(setactiveJoinedChat(chatId))
  }

  const openJoinedChatDetails = joinedChats.find(chat=>chat.chatId===activeJoinedChat)

  return (
    <>

    <header>
        <Navbar/>
    </header>
    <main className="h-[calc(100vh-3.5rem)]">
        <Outlet/>
    </main>

    <JoinedChatFloatingList
      toggleJoinedChatOpenClose={toggleJoinedChatOpenClose}
      joinedChats={joinedChats}
    />

      {
        activeJoinedChat && openJoinedChatDetails &&

        <motion.div variants={{hidden:{y:-10},animate:{y:0}}}
          initial="hidden"
          animate="animate"
          drag 
          className="bg-background text-text p-2 w-[30rem] max-h-[50rem] overflow-y-auto flex flex-col gap-y-6 fixed z-50 rounded-md shadow-2xl left-[40vw] top-12">

            <div className="flex gap-x-2">
                <Avatar
                  imgUrl={openJoinedChatDetails.avatar}
                  alt={openJoinedChatDetails.name}
                  height={14}
                  width={14}
                />
                <h5 className="text-xl">{openJoinedChatDetails.name}</h5>
            </div>

            <div className={`w-full gap-y-4 max-md:max-w-80 max-sm:max-w-64 rounded-2xl px-4 py-2 flex flex-col justify-center`}>

              {
                openJoinedChatDetails.messages.map(message=>(

                  <div key={message._id} className='bg-secondary-dark rounded-2xl px-4 py-2'>
                    <RenderAppropriateMessage
                      editMessageId=''
                      isGroupChat={true}
                      message={message}
                      myMessage={false}
                      setEditMessageId={()=>"asdf"}
                      setOpenContextMenuMessageId={()=>"void"}
                    />
                  </div>

                ))
              }
            </div>

        </motion.div>

      }

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
    </>
  )
}
