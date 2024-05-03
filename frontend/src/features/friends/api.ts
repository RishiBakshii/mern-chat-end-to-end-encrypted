import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from '../../config/envConfig'

export const friendsApi = createApi({

    reducerPath:"friendsApi",
    
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/request`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        sendFriendRequest:builder.mutation<void,{receiverId:string}>({
            query:({receiverId})=>({
                url:"/",
                method:"POST",
                body:{receiver:receiverId}
            })
        }),

    })
})

export const {
    useSendFriendRequestMutation
} = friendsApi