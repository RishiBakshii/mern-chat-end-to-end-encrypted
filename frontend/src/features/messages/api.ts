import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";
import type { IMessage } from "../../interfaces/messages";
import type { IChat } from "../../interfaces/chat";

export const messageApi = createApi({
    reducerPath:'messageApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}`,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        getMessagesByChatId:builder.query<Array<IMessage>,Pick<IChat,'_id'>>({
            query:({_id})=>`/message/${_id}`
        })
    })
})

export const {
    useLazyGetMessagesByChatIdQuery
} = messageApi