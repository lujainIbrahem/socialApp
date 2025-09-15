import { UserRepository } from './../../DB/repositories/user.repository';
import * as UV from "./user.validation"

import { NextFunction, Request, Response } from "express"
import userModel, { RoleType, userProvider } from '../../DB/models/user.model';
import { Compare, Hash } from '../../utils/Hash/hash';
import { eventEmiiter } from '../../utils/events';
import { generateOTP } from '../../service/sendEmail';
import { appError } from '../../utils/classError';
import { GenerateToken } from '../../utils/token';
import { RevokeTokenRepository } from '../../DB/repositories/revokeToken.repository';
import revokenTokenmodel from '../../DB/models/revokeToken.model';
import { v4 as uuidv4 } from "uuid";
import {OAuth2Client, TokenPayload} from 'google-auth-library' ;



class userService {
    private _userModel = new UserRepository(userModel)
    private _revokenTokenmodel = new RevokeTokenRepository(revokenTokenmodel)

    constructor(){}


    //==================signUp========================

    signUp = async (req:Request,res:Response,next:NextFunction)=>{
    const {userName,password,cPassword,email,age,gender,phone,address} : UV.signUpSchemaType = req.body
    if(await this._userModel.findOne({email}))
    {   throw new appError("email exist")  }    

    const hash = await Hash(password)
    const otp = await generateOTP()
    const hashOtp = await Hash(String(otp))
    eventEmiiter.emit("sendEmail", { email,otp })
    const user = await this._userModel.createOneUser({userName,otp:hashOtp,password:hash ,email,age,gender,phone,address})
    
    return res.status(201).json({message:"success", user})

    }

        //==================confirmedEmail========================

confirmedEmail = async (req:Request,res:Response,next:NextFunction)=>{

    const {email,otp} : UV.confirmedEmailSchemaType = req.body
    const user =await this._userModel.findOne({email ,confirmed: {$exists :false}})
    if(!user) {
    throw new appError("email not exist or not confirmed",404);    
    }
    if(!await Compare(otp ,user?.otp!)){
    throw new appError("invalid otp");
    }
    await this._userModel.updateOne({email:user?.email},{ confirmed:true , $unset:{otp :""}})
      
    return res.status(201).json({message:"confirmed"})
}



    //==================signIn========================

signIn =async (req:Request,res:Response,next:NextFunction)=>{
    const {email,password} : UV.signInSchemaType = req.body
    const user = await this._userModel.findOne({email ,confirmed: {$exists:true} , provider:userProvider.system})
    if(!user) {
    throw new appError("email not exist or not confirmed",404);    
    }
    if(!await Compare(password ,user?.password!)){
    throw new appError("invalid password");
    }

const jwtid = uuidv4();

    const access_token =await GenerateToken({
    payload:{ id:user._id ,email :user.email },
    signature: user.role == RoleType.admin? process.env.ACCESS_TOKEN_ADMIN!: process.env.ACCESS_TOKEN_USER!, 
    options:{  expiresIn : "1h" ,jwtid }
    });
    
    const refresh_token =await GenerateToken({
    payload:{ id:user._id , email :user.email },
    signature: user.role == RoleType.admin? process.env.REFRESH_TOKEN_ADMIN!: process.env.REFRESH_TOKEN_USER!,  
    options:{  expiresIn : "1y"  ,jwtid }
    });

    return res.status(201).json({message:"success",access_token,refresh_token})
}

    //==================getProfile========================

getProfile =async (req:Request,res:Response,next:NextFunction)=> {
       
    return res.status(201).json({message:"success",user:req.user})
}


    //==================logout========================

logout =async (req:Request,res:Response,next:NextFunction)=>{   
    const {flag} : UV.logOutSchemaType = req.body 
    
    if (flag === UV.FlagType?.all){
    await this._userModel.updateOne({_id: req.user?._id},{changeCredentails: new Date()})
    return res.status(200).json({message:"success ,logout from all devices"})

    }
        await this._revokenTokenmodel.create({
            tokenId:req.decoded?.jti!,
            userId:req.user?._id!,
            expireAt:new Date(req.decoded?.exp! * 1000)
        })
            return res.status(200).json({message:"success ,logout from this device"})


}

 //==================refreshToken========================

 refreshToken =async (req:Request,res:Response,next:NextFunction)=>{   
    

const jwtid = uuidv4();

    const access_token =await GenerateToken({
    payload:{ id:req?.user?._id ,email :req?.user?.email },
    signature: req?.user?.role == RoleType.admin? process.env.ACCESS_TOKEN_ADMIN!: process.env.ACCESS_TOKEN_USER!, 
    options:{  expiresIn : "1h" ,jwtid }
    });
    
    const refresh_token =await GenerateToken({
    payload:{ id:req?.user?._id , email :req?.user?.email },
    signature: req?.user?.role == RoleType.admin? process.env.REFRESH_TOKEN_ADMIN!: process.env.REFRESH_TOKEN_USER!,  
    options:{  expiresIn : "1y"  ,jwtid }
    });

        await this._revokenTokenmodel.create({
            tokenId:req.decoded?.jti!,
            userId:req.user?._id!,
            expireAt:new Date(req.decoded?.exp! * 1000)
        })
    return res.status(201).json({message:"success",access_token,refresh_token})


}

//======================== loginWithGmail =====================
 loginWithGmail = async(req:Request,res:Response,next:NextFunction)=>{

    
const { idToken }:UV.loginWithGmailSchemaType= req.body

const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID!, 
  });
  const payload = ticket.getPayload();
 return payload
}
const {name,picture,email_verified,email} = await verify() as TokenPayload

//check email
let user = await this._userModel.findOne( {email} )
if(!user){
   user =await this._userModel.create({
    userName:name!,
    email:email!,
    image:picture!,
    confirmed:email_verified!,
    provider:userProvider.google
   })
}

if(user.provider !== userProvider.google)
    {throw new Error("please login by system");}

const jwtid = uuidv4();

const access_token =await GenerateToken({
    payload:{ id:user._id ,email :user.email },
    signature: user?.role == RoleType.user? process.env.ACCESS_TOKEN_USER !: process.env.ACCESS_TOKEN_ADMIN!, 
    options:{  expiresIn : "1h" ,jwtid  }
});

const refresh_token =await GenerateToken({
    payload:{ id:user._id , email :user.email },
    signature: user?.role == RoleType.user? process.env.REFRESH_TOKEN_USER !: process.env.REFRESH_TOKEN_ADMIN !, 
    options:{  expiresIn : "1y" ,jwtid   }
});




return res.status(201).json({ message:"created success" , access_token , refresh_token })

}


//======================== forget Password =====================
forgetPassword = async(req:Request,res:Response,next:NextFunction)=>{
 
const { email }:UV.forgetPasswordSchemaType= req.body

//check email
const user = await this._userModel.findOne({ email })
if(!user){
    throw new appError("email not exit ",401);   
}

 const otp = await generateOTP()
const hashOtp = await Hash(String(otp))

//send Email
eventEmiiter.emit("forgetPassword",{ email,otp })
 
await this._userModel.updateOne({email:user?.email},{otp:hashOtp})
return res.status(200).json({message:" success"})

} 


//======================== reset Password =====================
resetPassword = async(req:Request,res:Response,next:NextFunction)=>{
 
const { email , otp ,password,cPassword }:UV.resetPasswordSchemaType= req.body

//check email
const user = await this._userModel.findOne({ email ,otp :{$exists :true} })
if(!user){
    throw new appError("email not exit or otp is incorrect , please try to forgetPassword first ", 401);   
}
 
if(!await Compare(otp , user?.otp!)){
throw new appError(" otp invalid");
}

const hash = await Hash(password);
await this._userModel.updateOne({email:user?.email},{
    password:hash ,
    $unset:{otp :""}
})

return res.status(200).json({message:" success"})

} 


//======================== update password =====================
updatePassword = async(req:Request,res:Response,next:NextFunction)=>{
 
const {oldPassword,newPassword,cPassword}:UV.updatePasswordSchemaType=req.body

if(!await Compare(oldPassword ,req?.user?.password!)){
    throw new appError("invalid oldPassword");   
}

const hash = await Hash(newPassword);

    await this._userModel.updateOne(
    { _id: req?.user?._id },
    { password: hash }
    )

await this._revokenTokenmodel.create({
  tokenId: req.decoded?.jti!,
  userId: req.user?._id!,
  expireAt: new Date(req.decoded?.exp! * 1000)
})

return res.status(200).json({message:"updated success"})

} 


//======================== update email =====================
updateEmail = async(req:Request,res:Response,next:NextFunction)=>{
 
const {oldEmail,newEmail}:UV.updateEmailSchemaType=req.body

const user = await this._userModel.findOne({email:oldEmail})
if (!user) {
  throw new appError("invalid email");
}

const exist = await this._userModel.findOne({ email: newEmail });
if (exist) throw new appError("Email already in use");

const otp = await generateOTP()
const hashOtp = await Hash(String(otp))
eventEmiiter.emit("sendEmail", { email:newEmail ,otp })

await this._userModel.updateOne(
  { _id: user?._id },
  { email: newEmail, otp: hashOtp, confirmed: false }
)

return res.status(200).json({message:"update email success"})

}




//======================== updateProfileInfo =====================
updateProfileInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, email, age, gender, phone, address }: UV.updateProfileSchemaType = req.body

const user = req.user  
console.log(user)
  if (!user) {
    throw new appError("User not found", 404)
  }

  if (userName) user.userName = userName
  if (age) user.age = age
  if (gender) user.gender = gender
  if (phone) user.phone = phone
  if (address) user.address = address

  if (email) {
    const existUser = await this._userModel.findOne({ email })
    if (existUser) {
      throw new appError("Email already exists", 401)
    }

    const otp = await generateOTP()
    const hashOtp = await Hash(String(otp))
    eventEmiiter.emit("sendEmail", { email, otp })

    await this._userModel.updateOne({_id:user?._id},  { email, otp: hashOtp, confirmed: false })

 
  }


  return res.status(200).json({
    message: "Profile updated successfully",
    user
  })
}



//======================== updateEmailTags =====================
updateEmailTags = async(req:Request,res:Response,next:NextFunction)=>{
 
const {email,type}:UV.updateEmailTagsSchemaType=req.body

const user = await this._userModel.findOne({email})
if (!user) {
  throw new appError("email not exist");
}

const otp = await generateOTP()
const hashOtp = await Hash(String(otp))

if(type == "confirm"){
eventEmiiter.emit("sendEmail", { email,otp })
}
if(type == "forget"){
eventEmiiter.emit("forgetPassword",{ email,otp })
}

return res.status(200).json({message:"Done go to signIn",email})

}

//======================== stepOneVerification =====================
stepOneVerification = async(req:Request,res:Response,next:NextFunction)=>{
 
const {email,password}:UV.stepOneVerificationSchemaType=req.body

const user = await this._userModel.findOne({email})
if (!user) {
  throw new appError("email not exist");
}
  if (user.confirmed) {
    throw new appError("user already confirmed");
  }

if(!await Compare(password ,user?.password!)){
throw new appError("invalid password");
}


const otp = await generateOTP()
const hashOtp = await Hash(String(otp))
eventEmiiter.emit("sendEmail", { email,otp })
await this._userModel.updateOne(  { email: user?.email },{otp:hashOtp})

return res.status(200).json({message:"Done on step 1 verification"})

}


//======================== stepTwoVerification =====================
stepTwoVerification = async(req:Request,res:Response,next:NextFunction)=>{
 
const {email,otp}:UV.stepTwoVerificationSchemaType=req.body

const user = await this._userModel.findOne({email})
if (!user) {
  throw new appError("email not exist");
}

if(!await Compare(otp ,user?.otp!)){
throw new appError("invalid otp");
}

    await this._userModel.updateOne({email:user?.email},{ confirmed:true , $unset:{otp :""}})
const jwtid = uuidv4();

    const access_token =await GenerateToken({
    payload:{ id:user._id ,email :user.email },
    signature: user.role == RoleType.admin? process.env.ACCESS_TOKEN_ADMIN!: process.env.ACCESS_TOKEN_USER!, 
    options:{  expiresIn : "1h" ,jwtid }
    });
    
    const refresh_token =await GenerateToken({
    payload:{ id:user._id , email :user.email },
    signature: user.role == RoleType.admin? process.env.REFRESH_TOKEN_ADMIN!: process.env.REFRESH_TOKEN_USER!,  
    options:{  expiresIn : "1y"  ,jwtid }
    });

    return res.status(201).json({message:"Done on step 2 verification",access_token,refresh_token})


}








} 


    

    
    



export default new userService()
