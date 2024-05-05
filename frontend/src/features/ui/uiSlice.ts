import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUi } from "../../interfaces/ui";
import { RootState } from "../../app/store";


const initialState:IUi = {
    navMenu:false,
    newgroupChatForm:false,
    addFriendForm:false,
    friendRequestForm:false,
    profileForm:false,
    memberForm:false
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
        setAddFriendForm:(state,action:PayloadAction<boolean>)=>{
            state.addFriendForm=action.payload
        },
        setFriendRequestForm:(state,action:PayloadAction<boolean>)=>{
            state.friendRequestForm=action.payload
        },
        setProfileForm:(state,action:PayloadAction<boolean>)=>{
            state.profileForm=action.payload
        },
        setMemberForm:(state,action:PayloadAction<boolean>)=>{
            state.memberForm=action.payload
        }
    }
})

// exporting selectors
export const selectNavMenu = (state:RootState)=>state.uiSlice.navMenu
export const selectGroupChatForm = (state:RootState)=>state.uiSlice.newgroupChatForm
export const selectAddFriendForm = (state:RootState)=>state.uiSlice.addFriendForm
export const selectFriendRequestForm = (state:RootState)=>state.uiSlice.friendRequestForm
export const selectProfileForm = (state:RootState)=>state.uiSlice.profileForm
export const selectMemberForm = (state:RootState)=>state.uiSlice.memberForm

// exporting actions
export const {
    setNavMenu,
    setNewgroupChatForm,
    setAddFriendForm,
    setFriendRequestForm,
    setProfileForm,
    setMemberForm,
} = uiSlice.actions

export default uiSlice