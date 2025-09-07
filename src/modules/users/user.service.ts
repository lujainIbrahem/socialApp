import { UserRepository } from './../../DB/repositories/user.repository';
import {  signUpSchemaType } from './user.validation';
import { NextFunction, Request, Response } from "express"
import userModel from '../../DB/models/user.model';
import { Hash } from '../../utils/Hash/hash';
import { eventEmiiter } from '../../utils/events';


class userService {
    private _userModel = new UserRepository(userModel)
    constructor(){}


    //==================signUp========================

    signUp = async (req:Request,res:Response,next:NextFunction)=>{

        let {userName,password,cPassword,email,age,gender,phone,address} : signUpSchemaType = req.body
        if(await this._userModel.findOne({email})) {
        throw new Error("email not exist");    
        }
        const hash = await Hash(password)
        const user =   await this._userModel.createOneUser({userName,password:hash ,email,age,gender,phone,address})
      eventEmiiter.emit("sendEmail",{ email })
        return res.status(201).json({message:"success", user})
    }



    //==================signIn========================

    signIn = (req:Request,res:Response,next:NextFunction)=>{
        return res.status(200).json({message:"success"})
    }

}

export default new userService()
