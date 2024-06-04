import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICallInRequestEventReceiveData, IJoinedChat } from "../../../interfaces/callIn";
import { IMessage, IUnreadMessage } from "../../../interfaces/messages";
import { IUi } from "../../../interfaces/ui";
import { RootState } from "../store/store";


const initialState:IUi = {
    isDarkMode:false,
    navMenu:false,
    newgroupChatForm:false,
    addMemberForm:false,
    addFriendForm:false,
    friendRequestForm:false,
    profileForm:false,
    removeMemberForm:false,
    gifForm:false,
    attachments:[],
    chatBar:true,
    chatDetailsBar:false,
    pollForm:false,
    viewVotes:false,
    votesData:null,
    chatUpdateForm:false,
    callInForm:false,
    callInRequests:[],
    callInRequestDisplay:false,
    joinedChats:[],
    activeJoinedChat:null,
    callOutForm:false,
    recoverPrivateKeyForm:false
}
const uiSlice = createSlice({
    name:"uiSlice",
    initialState,
    reducers:{
        setNavMenu:(state,action:PayloadAction<boolean>)=>{
            state.navMenu=action.payload
        },
        setNewgroupChatForm:(state,action:PayloadAction<boolean>)=>{
            state.newgroupChatForm=action.payload
        },
        setAddMemberForm:(state,action:PayloadAction<boolean>)=>{
            state.addMemberForm=action.payload
        },
        setAddFriendForm:(state,action:PayloadAction<boolean>)=>{
            state.addFriendForm=action.payload
        },
        setFriendRequestForm:(state,action:PayloadAction<boolean>)=>{
            state.friendRequestForm=action.payload
        },
        setProfileForm:(state,action:PayloadAction<boolean>)=>{
            state.profileForm=action.payload
        },
        setRemoveMemberForm:(state,action:PayloadAction<boolean>)=>{
            state.removeMemberForm=action.payload
        },
        setGifForm:(state,action:PayloadAction<boolean>)=>{
            state.gifForm=action.payload
        },
        setDarkMode:(state,action:PayloadAction<boolean>)=>{
            state.isDarkMode=action.payload
        },
        setAttachments:(state,action:PayloadAction<Array<string>>)=>{
            state.attachments.push(...action.payload)
        },
        resetAttachments:(state)=>{
            state.attachments=[]
        },
        setChatBar:(state,action:PayloadAction<boolean>)=>{
            state.chatBar=action.payload
        },
        setChatDetailsBar:(state,action:PayloadAction<boolean>)=>{
            state.chatDetailsBar=action.payload
        },
        setPollForm:(state,action:PayloadAction<boolean>)=>{
            state.pollForm=action.payload
        },
        setViewVotes:(state,action:PayloadAction<boolean>)=>{
            state.viewVotes=action.payload
        },
        setVotesData:(state,action:PayloadAction<Pick<IMessage,'pollQuestion' | 'pollOptions'>>)=>{
            state.votesData=action.payload
        },
        setChatUpdateForm:(state,action:PayloadAction<boolean>)=>{
            state.chatUpdateForm=action.payload
        },
        setCallInForm:(state,action:PayloadAction<boolean>)=>{
            state.callInForm=action.payload
        },
        setCallInRequests:(state,action:PayloadAction<ICallInRequestEventReceiveData>)=>{
            state.callInRequests.push(action.payload)
        },
        setCallInRequestDisplay:(state,action:PayloadAction<boolean>)=>{
            state.callInRequestDisplay=action.payload
        },
        deleteCallInRequest:(state,action:PayloadAction<{chatId:string}>)=>{
            state.callInRequests = state.callInRequests.filter(request=>request.chat.chatId!==action.payload.chatId)
        },
        setJoinedChats:(state,action:PayloadAction<IJoinedChat>)=>{
            state.joinedChats.push(action.payload)
        },
        setactiveJoinedChat:(state,action:PayloadAction<string>)=>{
            state.activeJoinedChat = action.payload
        },
        updateJoinedChatMessage:(state,action:PayloadAction<{joinedChatId:IJoinedChat['chatId'],newMessage:IMessage}>)=>{

            const joinedChat = state.joinedChats.find(joinedChat=>joinedChat.chatId===action.payload.joinedChatId)

            if(joinedChat){
                joinedChat.messages.push(action.payload.newMessage)
            }
        },
        updateJoinedChatUnreadMessage:(state,action:PayloadAction<{chatId:string,unreadMesage:IUnreadMessage['message']}>)=>{

            const joinedChat = state.joinedChats.find(joinedChat=>joinedChat.chatId===action.payload.chatId)

            if(joinedChat){
                joinedChat.unreadMessages.count += 1;
                joinedChat.unreadMessages.message = action.payload.unreadMesage;
            }
        },
        removeJoinedChat:(state,action:PayloadAction<{chatId:string}>)=>{
            state.joinedChats = state.joinedChats.filter(joinedChat=>joinedChat.chatId!==action.payload.chatId)
        },
        setCallOutForm:(state,action:PayloadAction<boolean>)=>{
            state.callOutForm=action.payload
        },
        setRecoverPrivateKeyForm:(state,action:PayloadAction<boolean>)=>{
            state.recoverPrivateKeyForm=action.payload
        }

    }
})

// exporting selectors
export const selectNavMenu = (state:RootState)=>state.uiSlice.navMenu
export const selectGroupChatForm = (state:RootState)=>state.uiSlice.newgroupChatForm
export const selectAddMemberForm = (state:RootState)=>state.uiSlice.addMemberForm
export const selectAddFriendForm = (state:RootState)=>state.uiSlice.addFriendForm
export const selectFriendRequestForm = (state:RootState)=>state.uiSlice.friendRequestForm
export const selectProfileForm = (state:RootState)=>state.uiSlice.profileForm
export const selectRemoveMemberForm = (state:RootState)=>state.uiSlice.removeMemberForm
export const selectGifForm = (state:RootState)=>state.uiSlice.gifForm
export const selectisDarkMode = (state:RootState)=>state.uiSlice.isDarkMode
export const selectAttachments = (state:RootState)=>state.uiSlice.attachments
export const selectChatBar = (state:RootState)=>state.uiSlice.chatBar
export const selectChatDetailsBar = (state:RootState)=>state.uiSlice.chatDetailsBar
export const selectPollForm = (state:RootState)=>state.uiSlice.pollForm
export const selectViewVotes = (state:RootState)=>state.uiSlice.viewVotes
export const selectVotesData = (state:RootState)=>state.uiSlice.votesData
export const selectChatUpdateForm = (state:RootState)=>state.uiSlice.chatUpdateForm
export const selectCallInForm = (state:RootState)=>state.uiSlice.callInForm
export const selectCallInRequests = (state:RootState)=>state.uiSlice.callInRequests
export const selectCallInRequestDisplay = (state:RootState)=>state.uiSlice.callInRequestDisplay
export const selectJoinedChats = (state:RootState)=>state.uiSlice.joinedChats
export const selectactiveJoinedChat = (state:RootState)=>state.uiSlice.activeJoinedChat
export const selectCallOutForm = (state:RootState)=>state.uiSlice.callOutForm
export const selectRecoverPrivateKeyForm = (state:RootState)=>state.uiSlice.recoverPrivateKeyForm

// exporting actions
export const {
    setNavMenu,
    setNewgroupChatForm,
    setAddMemberForm,
    setAddFriendForm,
    setFriendRequestForm,
    setProfileForm,
    setRemoveMemberForm,
    setGifForm,
    setDarkMode,
    setAttachments,
    resetAttachments,
    setChatBar,
    setChatDetailsBar,
    setPollForm,
    setViewVotes,
    setVotesData,
    setChatUpdateForm,
    setCallInForm,
    setCallInRequests,
    setCallInRequestDisplay,
    deleteCallInRequest,
    setJoinedChats,
    updateJoinedChatMessage,
    setactiveJoinedChat,
    updateJoinedChatUnreadMessage,
    removeJoinedChat,
    setCallOutForm,
    setRecoverPrivateKeyForm,
} = uiSlice.actions

export default uiSlice