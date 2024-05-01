import {configureStore} from '@reduxjs/toolkit'
import { authApi } from '../features/auth/api'
import authSlice from '../features/auth/authSlice'
import chatSlice from '../features/chat/chatSlice'
import { chatApi } from '../features/chat/api'
import { messageApi } from '../features/messages/api'

export const store = configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [authApi.reducerPath]:authApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer,
        [messageApi.reducerPath]:messageApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(chatApi.middleware)
    .concat(messageApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch