import { NextFunction, Request, Response } from "express";
import { decodedAndFetched, GetSignature, TokenType } from "../utils/token";

 

export const authentication =(tokenType:TokenType = TokenType.access)=>{
return async(req:Request,res:Response,next:NextFunction)=>{

const { authorization }= req.headers
var [prefix,token ] =authorization?.split(" ") || [] 
if(!prefix || !token)
    {
  throw new Error("token not exit", {cause :404});
}
const signature = await GetSignature(tokenType,prefix)
if(!signature){
    throw new Error("Invalid token", {cause :404});

}

const decoded = await decodedAndFetched(token,signature)

req.user =decoded?.user
req.decoded =decoded?.decoded

return next()

}

}