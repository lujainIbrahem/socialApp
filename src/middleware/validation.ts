import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"
import { appError } from "../utils/classError"

type ReqType = keyof Request //body.....params...
type schemaTypes = Partial<Record<ReqType ,ZodType>>

export const validation =(schema :schemaTypes)=>{
    return (req:Request,res:Response,next:NextFunction)=>{

        const validationErrors = []
        for (const key of Object.keys(schema) as ReqType[] ) {
            if(!schema[key]) continue

            const result = schema[key].safeParse(req[key])
            if(!result.success){
                validationErrors.push(result.error)
            }
        }
        if(validationErrors.length){
        throw new appError(JSON.parse(validationErrors as unknown as string));
    }
    next()

        }
    }
    
