import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { IAuth } from "../../../interfaces/auth";
import type { IUser } from "../../../interfaces/auth";
import { RootState } from "../store/store";

const initialState:IAuth = {
    loggedInUser:null
}
const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:({
        updateLoggedInUser:(state,action:PayloadAction<IUser>)=>{
            state.loggedInUser=action.payload
        },
        logout:(state)=>{
            state.loggedInUser=null
        }
    })
})

// exporting selectors
export const selectLoggedInUser = ((state:RootState)=>state.authSlice.loggedInUser)

// exporting reducers
export const {updateLoggedInUser,logout} = authSlice.actions

export default authSlice
