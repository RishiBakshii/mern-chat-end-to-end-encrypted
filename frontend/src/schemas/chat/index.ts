import { z } from "zod";

const groupChatSchema = z.object({
    name:z.string({required_error:"Name is required"})
    .min(3,{message:"Name must be minimum of 3 characters"})
    .max(25,{message:"Name cannot be more than 30 characters"}), 
})


type GroupChatSchemaType = z.infer<typeof groupChatSchema>

export {
    groupChatSchema,
    type GroupChatSchemaType
}