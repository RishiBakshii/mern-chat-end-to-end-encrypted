import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";
import type { IChatWithUnreadMessages } from "../../interfaces/chat";

export const chatApi = createApi({
    reducerPath:"chatApi",
    baseQuery:fetchBaseQuery({
        baseUrl:config.base_url,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        getChats:builder.query<Array<IChatWithUnreadMessages>,void>({
            query:()=>"/chat"
        }),
        createChat:builder.mutation<IChatWithUnreadMessages, Required<Pick<IChatWithUnreadMessages,'name'> & {members:Array<string>,isGroupChat:string}> & {avatar?:Blob}>({
            query:({name,members,isGroupChat,avatar})=>{

                const formData = new FormData()
                formData.append("name", name);
                for (const member of members) {
                    formData.append("members[]", member);
                }
                formData.append("isGroupChat", isGroupChat); 

                if(avatar){
                    formData.append("avatar",avatar)
                }

                return {
                    url: "/chat",
                    method: "POST",
                    body: formData,
                  };
            },

            async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                  const { data: createdChat } = await queryFulfilled
                  dispatch(
                    chatApi.util.updateQueryData('getChats', undefined, (draft) => {
                      draft.push(createdChat)
                    })
                  )
                } catch(error) {
                    console.log(error);
                }
              },
        }),
        addMember:builder.mutation<IChat,Pick<IChat, 'members' | '_id'>>({
            query:({_id,members})=>({
                url:`/chat/${_id}/members`,
                method:"PATCH",
                body:members
            })
        }),
        removeMember:builder.mutation<{removedMemberId:string},{chatId:string,memberId:string}>({
            query:({chatId,memberId})=>({
                url:`/chat/${chatId}/members`,
                method:"DELETE",
                body:{member:memberId}
            }),
            async onQueryStarted({chatId},{dispatch,queryFulfilled}){
                const {data:removedMemberId} = await queryFulfilled

                dispatch(
                    chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
                        const affectedChat = draft.find(chat=>chat._id===chatId)
                        if(affectedChat){
                            affectedChat.members=affectedChat.members.filter(member=>member._id!==removedMemberId)
                        }
                    })
                )
            }
        })
    })
})

export const {
    useLazyGetChatsQuery,
    useGetChatsQuery,
    useCreateChatMutation,
    useAddMemberMutation,
    useRemoveMemberMutation
} = chatApi