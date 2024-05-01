import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";
import type { IChat, IChatWithUnreadMessages } from "../../interfaces/chat";

export const chatApi = createApi({
    reducerPath:"chatApi",
    baseQuery:fetchBaseQuery({
        baseUrl:config.base_url,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        getChats:builder.query<IChatWithUnreadMessages,void>({
            query:()=>"/chat"
        }),
        createChat:builder.mutation<IChat,IChat>({
            query:(chat)=>({
                url:"/chat",
                method:"POST",
                body:chat
            })
        }),
        addMember:builder.mutation<IChat,Pick<IChat, 'members' | '_id'>>({
            query:({_id,members})=>({
                url:`/chat/${_id}/members`,
                method:"PATCH",
                body:members
            })
        }),
        removeMember:builder.mutation<IChat,Pick<IChat ,'_id'> & {member:string}>({
            query:({_id,member})=>({
                url:`/chat/${_id}/members`,
                method:"DELETE",
                body:member
            })
        })
    })
})

export const {
    useGetChatsQuery,
    useCreateChatMutation,
    useAddMemberMutation,
    useRemoveMemberMutation
} = chatApi