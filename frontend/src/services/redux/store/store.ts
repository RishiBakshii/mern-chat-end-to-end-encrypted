import {configureStore} from '@reduxjs/toolkit'

import { authApi } from '../../api/authApi'
import { friendsApi } from '../../api/requestApi'
import { messageApi } from '../../api/messageApi'
import { userApi } from '../../api/userApi'
import { chatApi } from '../../api/chatApi'

import uiSlice from '../slices/uiSlice'
import chatSlice from '../slices/chatSlice'
import authSlice from '../slices/authSlice'

export const store = configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [uiSlice.name]:uiSlice.reducer,
        [authApi.reducerPath]:authApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer,
        [messageApi.reducerPath]:messageApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
        [friendsApi.reducerPath]:friendsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(chatApi.middleware)
    .concat(messageApi.middleware)
    .concat(userApi.middleware)
    .concat(friendsApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch