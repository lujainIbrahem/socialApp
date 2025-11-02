import { NextFunction, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import ChatModel from '../../DB/models/chat.model';
import { chatRepository } from '../../DB/repositories/chat.repository';
import { appError } from '../../utils/classError';
import { UserRepository } from '../../DB/repositories/user.repository';
import userModel from '../../DB/models/user.model';
import { connectionSocket } from '../gateway/gateway';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

export class chatService{
    constructor(){}
    private _ChatModel = new chatRepository(ChatModel)
    private _userModel = new UserRepository(userModel)
    

    //rest api
getChat =async (req:Request,res:Response,next:NextFunction)=>{
    const {userId}=req.params
    const chat  = await this._ChatModel.findOne({
        participants:{ $all :[userId,req?.user?._id]},
        group:{$exists:false}
    },
    {
        messages:{
            $slice:[-5,5]
        }
    },{
        populate:[{
            path:"participants"
        }]
    })
    if(!chat){
        throw new appError("chat not found ",404)
    }

    return res.status(201).json({message:"Done",chat})
}

createGroupChat =async (req:Request,res:Response,next:NextFunction)=>{
    const {group,participants}=req.body
    const createdBy=req?.user?._id
    const dbPartcipants = participants.map((participants:string)=>Types.ObjectId.createFromHexString(participants))

const user = await this._userModel.find(
{
    filter:
    {
    _id:{$in :dbPartcipants},
    friends: {$in:[createdBy]}
    }
}) 

if(user.length !== participants.length)
    { throw new appError("user not found",404)}
const roomId = group?.replaceAll(/\s+/g, "_") + "_" + uuidv4();
dbPartcipants.push(createdBy)

const chat= await this._ChatModel.create({
    participants:dbPartcipants,
    group,
    roomId,
  createdBy: createdBy!,
    messages:[]
})
console.log("Created Chat Doc:", chat);


    return res.status(201).json({message:"Done",chat})
}

getGroupChat =async (req:Request,res:Response,next:NextFunction)=>{
    const {groupId}=req.params
    const chat  = await this._ChatModel.findOne({
        participants:{ $in :[req?.user?._id]},
        _id:groupId,
        group:{$exists:true}
    },undefined,{
        populate:[{
            path:"messages.createdBy"
        }]
    })
    if(!chat){
        throw new appError("chat not found ",404)
    }

    return res.status(201).json({message:"Done",chat})
}
    //socket io
    sayHi=async(data:any,socket:Socket,io:Server)=>{
    console.log(data);
    
    
    }

    sendMessage=async(data:any,socket:Socket,io:Server)=>{
        
const {content,sendTo}=data
const createdBy = socket?.data.user._id

const user = await this._userModel.findOne({
_id:sendTo,
friends:{$in:[createdBy]}
}) 
        if(!user){
        throw new appError("user not found ",404)
    }
    const chat = await this._ChatModel.findOneAndUpdate(
    {
participants:{$all:[createdBy,sendTo]},
group:{$exists:false}
},{
    $push:{
    messages:{
        content,createdBy
    }
    }
}) 
    if(!chat){
const newChat= await this._ChatModel.create({
    participants:[createdBy,sendTo],
    createdBy,
    messages:[{content,createdBy}]
})
    }
    io.to(connectionSocket.get(createdBy.toString())!).emit("successMessage",{content})
    io.to(connectionSocket.get(sendTo.toString())!).emit("newMessage",{content , from:socket.data.user})

    }

sendGroupMessage=async(data:any,socket:Socket,io:Server)=>{
        
const {content,groupId}=data
const createdBy = socket?.data.user._id

const chat = await this._ChatModel.findOneAndUpdate({
_id:groupId,
participants:{
    $all:[createdBy]
},
    group:{
        $exists:true
    }
},{
    $push:{
        messages:{
            content,
            createdBy
        }
    }
}) 
    if(!chat){
        throw new appError("chat not found ",404)
    }
    io.to(connectionSocket.get(createdBy.toString())!).emit("successMessage",{content})
    io.to(chat?.roomId!).emit("newMessage",{content , from:socket.data.user,groupId})

    }

    join_room=async(data:any,socket:Socket,io:Server)=>{
    console.log({ data })
    const {roomId} = data 
    const chat = await this._ChatModel.findOne({
        roomId,
        group:{$exists:true},
        participants:{$in:[socket?.data?.user?._id]}
    })
    if(!chat)
        { throw new appError("chat not found ",404)}

    socket.join(chat?.roomId!)    

    }

}
