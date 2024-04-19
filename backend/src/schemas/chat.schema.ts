import { z } from "zod";


export const createChatSchema = z.object({
    name:z.string().optional(), 
    isGroupChat:z.boolean().default(false),
    members:z.string({required_error:"members are required"}).array().min(1,'Atleast 1 member is required to create a chat').max(30,'Chat members cannot be more than 30'),
    avatar:z.string().optional(),
})


export type createChatSchemaType = z.infer<typeof createChatSchema>