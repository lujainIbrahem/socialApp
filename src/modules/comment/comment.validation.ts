
import z from "zod"
import { generalRules } from "../../utils/generalRules"
import { onModelEnum } from "../../DB/models/comment.model"



export const createCommentSchema = {
    params:z.strictObject({
        postId:generalRules.id,
        commentId:generalRules.id.optional(),
    }),
    body :z.strictObject({
        content:z.string(),
        onModel:z.enum(onModelEnum),
        tags:z.array(generalRules.id).refine((value)=>{
            return new Set(value).size === value?.length
        },
        {message:"duplicate user"}).optional(),
    }).superRefine((data,ctx)=>{
        if(!Object.values(data).length){
            ctx.addIssue({
                code:"custom",
                message:"at least one field is required"
            })
        }
    })
}


export type createCommentSchemaType = z.infer<typeof createCommentSchema.body>;
export type createCommentSchemaTypee = z.infer<typeof createCommentSchema.params>;
