import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";
import { IFriend } from "../../interfaces/friends";

export const friendApi = createApi({
    reducerPath:"friendApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/friend`,
        credentials:"include"
    }),

    endpoints:(builder)=>({
        getFriends:builder.query<IFriend,void>({
            query:()=>"/"
        })
    })
})

export const {
    useGetFriendsQuery
} = friendApi