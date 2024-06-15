import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";
import { IAttachment } from "../../interfaces/attachment";

export const attachmentApi = createApi({
    reducerPath:"attachmentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/attachment`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        sendAttachments:builder.mutation<void,{chatId:string,attachments:Array<Blob>}>({

            
            query:({chatId,attachments})=>{

                const formData = new FormData()

                formData.append("chatId",chatId)

                for (const attachment of attachments) {
                    formData.append("attachments[]", attachment);
                }

                return {
                    method:"POST",
                    url:"/",
                    body:formData,
                }
                
            }
        }),

        fetchAttachments:builder.query<IAttachment,{chatId:string,page:number}>({ 
            query:({chatId,page})=>`/${chatId}?page=${page}`,

            serializeQueryArgs:({endpointName,queryArgs:{chatId}})=>{
                return `${endpointName}_${chatId}`
            },

            merge: (currentCache, newItems) => {
                currentCache.attachments.push(...newItems.attachments)
                currentCache.totalPages=newItems.totalPages
            },
        })
    })
})

export const {
    useSendAttachmentsMutation,
    useLazyFetchAttachmentsQuery,
} = attachmentApi