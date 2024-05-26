import { z } from "zod";
export const createRequestSchema = z.object({
    receiver: z.string({ required_error: "Receiver is required to send a request" })
});
export const handleRequestSchema = z.object({
    action: z.enum(['accept', 'reject'], { required_error: "action is required" })
});
