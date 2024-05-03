import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUi } from "../../interfaces/ui";
import { RootState } from "../../app/store";


const initialState:IUi = {
    navMenu:false,
    newgroupChatForm:false,
    addFriendForm:false
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
        }
    }
})

// exporting selectors
export const selectNavMenu = (state:RootState)=>state.uiSlice.navMenu
export const selectGroupChatForm = (state:RootState)=>state.uiSlice.newgroupChatForm
export const selectAddFriendForm = (state:RootState)=>state.uiSlice.addFriendForm

// exporting actions
export const {
    setNavMenu,
    setNewgroupChatForm,
    setAddFriendForm,
} = uiSlice.actions

export default uiSlice