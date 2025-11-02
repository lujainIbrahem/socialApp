
import z from "zod"
import { generalRules } from "../../utils/generalRules"
import { availabilityEnum } from "../../DB/models/post.model"



export const createPostSchema = {
    body :z.strictObject({
        content:z.string(),
        availability:z.enum(availabilityEnum).default(availabilityEnum.public).optional(),
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

export const updatePostSchema = {
    
      body :z.strictObject({
        content:z.string(),
        availability:z.enum(availabilityEnum).default(availabilityEnum.public).optional(),
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



export const likePostSchema = {
    params :z.strictObject({
        postId:generalRules.id
    })
}


export const unLikePostSchema = {
     body :z.strictObject({
        postId:z.string(),
    })
}


export type createPostSchemaType = z.infer<typeof createPostSchema.body>;

export type updatePostSchemaType = z.infer<typeof updatePostSchema.body>;



export type likePostSchemaType = z.infer<typeof likePostSchema.params>;

export type unLikePostSchemaType = z.infer<typeof unLikePostSchema.body>;
