import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { config } from '../../config/envConfig'
import { IUser } from '../../interfaces/auth'

export const userApi = createApi({

    reducerPath:"userApi",
    
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/user`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        searchUser:builder.query<Array<Pick<IUser,'_id' |'name' | 'username' | "avatar">>, IUser['username']>({
            query:(username)=>`/search?username=${username}`
        }),

    })
})

export const {
    useLazySearchUserQuery
} = userApi