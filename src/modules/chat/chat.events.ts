import { Server, Socket } from "socket.io"
import ChatModel from "../../DB/models/chat.model"
import { chatRepository } from "../../DB/repositories/chat.repository"
import { chatService } from "./chat.service"

export class chatEvents{
        private _chatService : chatService = new chatService()
    
    constructor(){}

sayHi=(socket:Socket,io:Server)=>{
     socket.on("sayHi",(data)=>{
        this._chatService.sayHi(data,socket,io)
       })
    }

sendMessage=(socket:Socket,io:Server)=>{
     socket.on("sendMessage",(data)=>{
        this._chatService.sendMessage(data,socket,io)
       })
    }

join_room=(socket:Socket,io:Server)=>{
     socket.on("join_room",(data)=>{
        this._chatService.join_room(data,socket,io)
       })
    }
    sendGroupMessage=(socket:Socket,io:Server)=>{
     socket.on("sendGroupMessage",(data)=>{
        this._chatService.sendGroupMessage(data,socket,io)
       })
    }
}