import { chatEvents } from './chat.events';
import { Server, Socket } from 'socket.io';

export class chatGateway{
    private  _chatEvents :chatEvents= new chatEvents()

    constructor(){}

    register=(socket:Socket,io:Server)=>{
    this._chatEvents.sayHi(socket,io)
    this._chatEvents.sendMessage(socket,io)
    this._chatEvents.join_room(socket,io)
    this._chatEvents.sendGroupMessage(socket,io)
        
    }

}