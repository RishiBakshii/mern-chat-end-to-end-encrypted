import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { IAuth } from "../../../interfaces/auth";
import type { IUser } from "../../../interfaces/auth";
import { RootState } from "../store/store";

const initialState:IAuth = {
    loggedInUser:null,
}
const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:({
        updateLoggedInUser:(state,action:PayloadAction<IUser>)=>{
            state.loggedInUser=action.payload
        },
        updateLoggedInUserPublicKey:(state,action:PayloadAction<Pick<IUser,'publicKey'>>)=>{
            if(state.loggedInUser){
                state.loggedInUser.publicKey = action.payload.publicKey
            }
        },
        updateLoggedInUserNotificationStatus:(state,action:PayloadAction<boolean>)=>{
            if(state.loggedInUser){
                state.loggedInUser.notificationsEnabled = action.payload
            }
        },
        updateLoggedInUserFcmTokenStatus:(state,action:PayloadAction<boolean>)=>{
            if(state.loggedInUser){
                state.loggedInUser.fcmTokenExists = action.payload
            }
        },
        logout:(state)=>{
            state.loggedInUser=null
        }
    })
})

// exporting selectors
export const selectLoggedInUser = ((state:RootState)=>state.authSlice.loggedInUser)

// exporting reducers
export const {
    updateLoggedInUser,
    updateLoggedInUserPublicKey,
    updateLoggedInUserNotificationStatus,
    updateLoggedInUserFcmTokenStatus,
    logout

} = authSlice.actions

export default authSlice
