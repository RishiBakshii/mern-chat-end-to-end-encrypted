import { z } from "zod";

export const notificationsSchema = z.object({
    isEnabled:z.boolean({required_error:"isEnabled is required"})
})

export type notificationsSchemaType = z.infer<typeof notificationsSchema>