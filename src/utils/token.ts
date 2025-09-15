import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { appError } from './classError';
import userModel from '../DB/models/user.model';
import { UserRepository } from '../DB/repositories/user.repository';
import { RevokeTokenRepository } from '../DB/repositories/revokeToken.repository';
import revokenTokenmodel from '../DB/models/revokeToken.model';


const  _userModel = new UserRepository(userModel)
const   _revokenTokenmodel = new RevokeTokenRepository(revokenTokenmodel)


export enum TokenType {
    access ="access",
    refresh="refresh"
}

export const GenerateToken = async ({payload,signature,options}:{
    payload:object,
    signature:string,
    options:SignOptions
}):Promise<string>=>{
    return jwt.sign( payload,signature,options);
    
}

export const VerifyToken = async ({token ,signature}:{
    token:string
    ,signature:string
}):Promise<JwtPayload>=>{
    return jwt.verify( token ,signature)  as JwtPayload
  
}

export const GetSignature =async (tokenType:TokenType,prefix:string) => {

if(tokenType ===TokenType.access)
    {
    if (prefix == "user"){
return process.env.ACCESS_TOKEN_USER
}

else if(prefix =="admin"){
  return process.env.ACCESS_TOKEN_ADMIN
}
else{
    return null
}
    }

if(tokenType ===TokenType.refresh)
    {
    if (prefix == "user"){
return process.env.REFRESH_TOKEN_USER
}

else if(prefix =="admin"){
  return process.env.REFRESH_TOKEN_ADMIN
}
else{
    return null
}
    }

    return null;


}


export const decodedAndFetched =async(token:string,signature:string) =>{

const decoded =await VerifyToken({token, signature});

if(!decoded) { throw new appError("not decoded") }

const user = await _userModel.findOne({email: decoded.email})

if(!user){
  throw new appError("user not exit", 401);
}

if(!user?.confirmed){
  throw new appError("user not confirmed", 401);
}
 
if(await _revokenTokenmodel.findOne({tokenId:decoded?.jti!})){
  throw new appError("token has been revoked", 401);
}
if(user?.changeCredentails?.getTime()! >decoded?.iat! *1000 ){
      throw new appError("token has been revoked", 401);

}

return{decoded,user}


}


