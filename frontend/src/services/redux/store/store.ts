import {configureStore} from '@reduxjs/toolkit'

import { authApi } from '../../api/authApi'
import { messageApi } from '../../api/messageApi'
import { userApi } from '../../api/userApi'
import { chatApi } from '../../api/chatApi'
import { requestApi } from '../../api/requestApi'
import { friendApi } from '../../api/friendApi'

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
        [requestApi.reducerPath]:requestApi.reducer,
        [friendApi.reducerPath]:friendApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(chatApi.middleware)
    .concat(messageApi.middleware)
    .concat(userApi.middleware)
    .concat(requestApi.middleware)
    .concat(friendApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch