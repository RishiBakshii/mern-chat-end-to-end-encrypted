import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChatIntitalState, IChatMember, IChatWithUnreadMessages, ISpectator } from "../../../interfaces/chat";
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
        updateSelectedChatDetails:(state,action:PayloadAction<IChatWithUnreadMessages | null>)=>{
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
        updateSelectedChatMembers:(state,action:PayloadAction<Array<IChatMember>>)=>{
            
            if(state.selectedChatDetails && state.selectedChatDetails.members.length){
                state.selectedChatDetails.members.push(...action.payload)
            }
        },
        removeSelectedChatMembers:(state,action:PayloadAction<Array<string>>)=>{

                        
            if(state.selectedChatDetails && state.selectedChatDetails.members.length){
                state.selectedChatDetails.members = state.selectedChatDetails.members.filter(member=>!action.payload.includes(member._id))
            }

        },
        updateSpectators:(state,action:PayloadAction<ISpectator>)=>{
            state.selectedChatDetails?.spectators.push(action.payload)
        },
        removeSpectators:(state,action:PayloadAction<{spectatorId:string}>)=>{

            if(state.selectedChatDetails && state.selectedChatDetails.spectators){
                state.selectedChatDetails.spectators = state.selectedChatDetails.spectators.filter(spec=>spec._id!==action.payload.spectatorId)
            }
        }

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
    updateSelectedChatMembers,
    removeSelectedChatMembers,
    updateSpectators,
    removeSpectators,
} = chatSlice.actions

export default chatSlice