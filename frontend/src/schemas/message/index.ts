import { z } from "zod";

const pollSchema  = z.object({

    question:z.string({required_error:"Question is required"})
    .min(3,{message:"Question cannot be shorter than 3 characters"})
    .max(80,{message:"Question cannot be longer than 80 characters"}),

    options:z.object({
        optionValue:z.string()
            .min(1,{message:"Option cannot be shorter than 1 character"})
            .max(40,{message:"Option cannot be longer than 40 characters"})
    }).array()


})


export {
    pollSchema
}

export type pollSchemaType = z.infer<typeof pollSchema>