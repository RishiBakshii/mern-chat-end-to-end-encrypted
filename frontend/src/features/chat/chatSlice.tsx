import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChatIntitalState } from "../../interfaces/chat";
import { RootState } from "../../app/store";

const initialState:IChatIntitalState =  {
    selectedChatId:null
}
const chatSlice = createSlice({
    name:"chatSlice",
    initialState,
    reducers:{
        updateSelectedChatId:(state,action:PayloadAction<IChatIntitalState['selectedChatId']>)=>{
            state.selectedChatId=action.payload
        }
    },
})

// exporting selector
export const selectSelectedChatId = (state:RootState)=>state.chatSlice.selectedChatId

// exporting actions
export const {
    updateSelectedChatId
} = chatSlice.actions

export default chatSlice