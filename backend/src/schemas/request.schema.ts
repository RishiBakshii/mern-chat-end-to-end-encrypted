import { z } from "zod";

export const createRequestSchema = z.object({
    receiver:z.string({required_error:"Receiver is required to send a request"})
})


export type createRequestSchemaType = z.infer<typeof createRequestSchema>