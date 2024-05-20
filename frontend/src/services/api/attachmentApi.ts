import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/envConfig";

export const attachmentApi = createApi({
    reducerPath:"attachmentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/attachment`,
        credentials:"include"
    }),

    endpoints:(builder)=>({
        sendAttachments:builder.mutation<void,{chatId:string,members:Array<string>,attachments:Array<Blob>}>({

            
            query:({chatId,members,attachments})=>{

                const formData = new FormData()

                formData.append("chatId",chatId)

                for (const member of members) {
                    formData.append("memberIds", member);
                }

                for (const attachment of attachments) {
                    formData.append("attachments[]", attachment);
                }

                return {
                    method:"POST",
                    url:"/",
                    body:formData,
                }
                
            }
        })
    })
})

export const {
    useSendAttachmentsMutation,
} = attachmentApi