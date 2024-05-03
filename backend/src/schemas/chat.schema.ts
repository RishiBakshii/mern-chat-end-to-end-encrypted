import { z } from "zod";


export const createChatSchema = z.object({
    name:z.string().optional(), 
    isGroupChat:z.string(),
    members:z.string({required_error:"members are required"}).array().min(1,'Atleast 1 member is required to create a chat').max(30,'Chat members cannot be more than 30'),
    avatar:z.string().optional(),
})


export const addMemberToChatSchema = z.object({
    members:z.string({required_error:"Atlest one member is required to add to chat"}).array()
})

export const removeMemberfromChat = z.object({
    member:z.string({required_error:"Member is required to remove from the chat"})
})


export type createChatSchemaType = z.infer<typeof createChatSchema>
export type addMemberToChatType = z.infer<typeof addMemberToChatSchema>
export type removeMemberfromChatType = z.infer<typeof removeMemberfromChat>