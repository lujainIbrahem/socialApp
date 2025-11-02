import { NextFunction, Request, Response } from "express";
import { appError } from "../utils/classError";
import { RoleType } from "../DB/models/user.model";

export const Authorization = ({accessRules = []}:{accessRules:RoleType[]})=>{

    return (req:Request,res:Response,next:NextFunction)=>{

    if (!accessRules?.includes(req.user?.role!)){
        throw new appError("user not authorized")
            
    }
        return next()
    }
}