import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUi } from "../../../interfaces/ui";
import { RootState } from "../store/store";
import { IMessage } from "../../../interfaces/messages";


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
    votesData:null
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
} = uiSlice.actions

export default uiSlice