import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUi } from "../../interfaces/ui";
import { RootState } from "../../app/store";


const initialState:IUi = {
    navMenu:false,
    newgroupChatForm:false
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
        }
    }
})

// exporting selectors
export const selectNavMenu = (state:RootState)=>state.uiSlice.navMenu
export const selectGroupChatForm = (state:RootState)=>state.uiSlice.newgroupChatForm

// exporting actions
export const {
    setNavMenu,
    setNewgroupChatForm
} = uiSlice.actions

export default uiSlice