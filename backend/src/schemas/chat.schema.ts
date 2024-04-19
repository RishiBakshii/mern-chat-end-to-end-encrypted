import { z } from "zod";


export const createChatSchema = z.object({
    name:z.string().optional(), 
    isGroupChat:z.boolean().default(false),
    members:z.array(z.string()).min(2,'Atleast 2 members are required to start a chat').max(30,'Group members cannot be more than 30'),
    avatar:z.string().optional(),
})


export type createChatSchemaType = z.infer<typeof createChatSchema>