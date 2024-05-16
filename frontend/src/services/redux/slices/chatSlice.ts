import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChatIntitalState, IChatMember, IChatWithUnreadMessages } from "../../../interfaces/chat";
import { RootState } from "../store/store";

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
        updateSeenByList:(state,action:PayloadAction<IChatMember>)=>{
            state.selectedChatDetails?.seenBy.push(action.payload)
        },
        resetSeenByList:(state)=>{
            if(state.selectedChatDetails){
                state.selectedChatDetails.seenBy = []
            }
        },
        updateUserTyping:(state,action:PayloadAction<IChatMember>)=>{
            state.selectedChatDetails?.userTyping.push(action.payload)
        },
        removeUserTyping:(state,action:PayloadAction<IChatMember>)=>{
            
            if(state.selectedChatDetails?.userTyping){
                state.selectedChatDetails.userTyping = state.selectedChatDetails?.userTyping.filter(user=>user._id!==action.payload._id)
            }
            
        },

    },
})

// exporting selector
export const selectSelectedChatId = (state:RootState)=>state.chatSlice.selectedChatId
export const selectSelectedChatDetails = (state:RootState)=>state.chatSlice.selectedChatDetails

// exporting actions
export const {
    updateSelectedChatId,
    updateSelectedChatDetails,
    updateSeenByList,
    resetSeenByList,
    updateUserTyping,
    removeUserTyping,
} = chatSlice.actions

export default chatSlice