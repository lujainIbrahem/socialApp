import { GenderType } from './../../DB/models/user.model';

import z from "zod"

export enum FlagType {
   all ="all",
   current ="current"
}


export const signInSchema = {
    body :z.strictObject({
        email:z.email(),
        password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    }).required()
}

export const signUpSchema = {
    body :signInSchema.body.extend({
        userName:z.string().min(3).trim(),
        cPassword:z.string(),
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


export const confirmedEmailSchema = {
    body :z.strictObject({
        email:z.email(),
        otp:z.string().regex(/^\d{6}$/).trim()
    }).required()
}

export const logOutSchema = {
    body :z.strictObject({
       flag:z.enum(FlagType)
    }).required()
}


export const loginWithGmailSchema = {
    body :z.strictObject({
       idToken:z.string()
    }).required()
}



export const forgetPasswordSchema = {
    body :z.strictObject({
    email:z.email()

    }).required(),
}


export const resetPasswordSchema = {
    body :confirmedEmailSchema.body.extend({
    password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    cPassword:z.string(),
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


export const updatePasswordSchema = {
    body :z.strictObject({
        oldPassword:z.string(),
        newPassword:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        cPassword:z.string(),
    }).required().superRefine((data,ctx)=>{
        if(data.newPassword !== data.cPassword){
            ctx.addIssue({
                code:"custom",
                path:["cPassword"],
                message:"password not match with cPassword"
            })
        }
    }),
}



export const updateEmailSchema = {
    body :z.strictObject({
       oldEmail:z.email(),
       newEmail:z.email()
    }).required().refine(data => data.oldEmail !== data.newEmail, {
  message: "newEmail must be different from oldEmail",
  path: ["newEmail"]
})
}


export const updateProfileSchema = {
    body :z.strictObject({
        userName:z.string().min(3).trim(),
        email:z.email(),
        age:z.number().min(18).max(60),
        address:z.string(),
        phone:z.string(),
        gender:z.enum([GenderType.male,GenderType.female])
    })
}


export const updateEmailTagsSchema = {
    body :z.strictObject({
       email:z.string(),
       type:z.string(),
       
    }).required()
}


export const stepOneVerificationSchema = {
    body :z.strictObject({
       email:z.string(),
    password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
       
    }).required()
}


export const stepTwoVerificationSchema = {
    body :z.strictObject({
    email:z.string(),
    otp:z.string().regex(/^\d{6}$/).trim()
       
    }).required()
}



export type signInSchemaType = z.infer<typeof signInSchema.body>;

export type signUpSchemaType = z.infer<typeof signUpSchema.body>;

export type confirmedEmailSchemaType = z.infer<typeof confirmedEmailSchema.body>;

export type logOutSchemaType = z.infer<typeof logOutSchema.body>;

export type loginWithGmailSchemaType = z.infer<typeof loginWithGmailSchema.body>;

export type forgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema.body>;

export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema.body>;

export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema.body>;

export type updateEmailSchemaType = z.infer<typeof updateEmailSchema.body>;

export type updateProfileSchemaType = z.infer<typeof updateProfileSchema.body>;

export type updateEmailTagsSchemaType = z.infer<typeof updateEmailTagsSchema.body>;

export type stepOneVerificationSchemaType = z.infer<typeof stepOneVerificationSchema.body>;

export type stepTwoVerificationSchemaType = z.infer<typeof stepTwoVerificationSchema.body>;
