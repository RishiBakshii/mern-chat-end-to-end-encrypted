import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChatIntitalState, IChatWithUnreadMessages } from "../../interfaces/chat";
import { RootState } from "../../app/store";

const initialState:IChatIntitalState =  {
    selectedChatId:null,
    selectedChatDetails:null
}
const chatSlice = createSlice({
    name:"chatSlice",
    initialState,
    reducers:{
        updateSelectedChatId:(state,action:PayloadAction<IChatIntitalState['selectedChatId']>)=>{
            state.selectedChatId=action.payload
        },
        updateSelectedChatDetails:(state,action:PayloadAction<IChatWithUnreadMessages>)=>{
            state.selectedChatDetails=action.payload
        },

    },
})

// exporting selector
export const selectSelectedChatId = (state:RootState)=>state.chatSlice.selectedChatId
export const selectSelectedChatDetails = (state:RootState)=>state.chatSlice.selectedChatDetails

// exporting actions
export const {
    updateSelectedChatId,
    updateSelectedChatDetails
} = chatSlice.actions

export default chatSlice