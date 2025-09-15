
import z from "zod"



export const createPostSchema = {
    body :z.strictObject({
        content:z.string(),
    }).required()
}



export const likePostSchema = {
    body :z.strictObject({
        postId:z.string(),
    }).required()
}


export const unLikePostSchema = {
     body :z.strictObject({
        postId:z.string(),
    }).required()
}


export type createPostSchemaType = z.infer<typeof createPostSchema.body>;
export type likePostSchemaType = z.infer<typeof likePostSchema.body>;

export type unLikePostSchemaType = z.infer<typeof unLikePostSchema.body>;
