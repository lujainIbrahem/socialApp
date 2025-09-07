import { GenderType } from './../../DB/models/user.model';

import z from "zod"


export const signUpSchema = {
    body :z.object({
        userName:z.string().min(3).trim(),
        password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        cPassword:z.string(),
        email:z.email(),
        age:z.number().min(18).max(60),
        address:z.string(),
        phone:z.string(),
        gender:z.enum([GenderType.male,GenderType.female])
    }).required().superRefine((data,ctx)=>{
        if(data.password !== data.cPassword){
            ctx.addIssue({
                code:"custom",
                path:["cPassword"],
                message:"password not match with cPassword"
            })
        }
    })
}


export type signUpSchemaType = z.infer<typeof signUpSchema.body>;