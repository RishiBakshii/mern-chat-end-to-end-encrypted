import {configureStore} from '@reduxjs/toolkit'
import { authApi } from '../features/auth/api'
import authSlice from '../features/auth/authSlice'
import chatSlice from '../features/chat/chatSlice'

export const store = configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [authApi.reducerPath]:authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch