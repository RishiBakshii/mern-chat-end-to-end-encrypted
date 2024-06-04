import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";
import type { IMessage } from "../../interfaces/messages";


export const messageApi = createApi({
    reducerPath:'messageApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}`,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        getMessagesByChatId:builder.query<{messages:Array<IMessage>,totalPages:number},{_id:string,page:number}>({

            query:({_id,page})=>`/message/${_id}?page=${page}`,
            
            // Merge the new page of messages with the previous ones
            serializeQueryArgs: ({ endpointName ,queryArgs:{_id}}) => {
              return  `${endpointName}_${_id}`
            },
            merge: (currentCache, newItems) => {
                currentCache.messages.unshift(...newItems.messages)
            },

        })
        
    })
})

export const {
    useLazyGetMessagesByChatIdQuery
} = messageApi