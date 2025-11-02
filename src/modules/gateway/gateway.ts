import { Server } from "socket.io"
import { decodedAndFetched, GetSignature,TokenType } from "../../utils/token"
import { Server as httpServer } from "http"
import { SocketWithUser } from "./gateway.interface"
import { chatGateway } from "../chat/chat.gateway"
import { appError } from "../../utils/classError"

export const connectionSocket =new Map<string,string[]>()
let io : Server | undefined = undefined

export const InitializationIo=(httpServer:httpServer) =>{

     io = new Server(httpServer, {
  cors: {
    origin: "*"
  }}
)

//middleware

io.use(async(socket:SocketWithUser, next) => {
    try {

        console.log("connect");
        
        const { authorization }= socket.handshake.auth
        var [prefix,token ] =authorization?.split(" ") || []
         
        if(!prefix || !token)
        {
        return next (new Error("token not exit", {cause :404}))
        }
        const signature = await GetSignature(TokenType.access, prefix)
        if(!signature){
        return next (new Error("Invalid token", {cause :404}))
        }
        
        const {user,decoded} = await decodedAndFetched(token,signature)
        const socketIds=connectionSocket.get(user?._id?.toString()) || []
        socketIds.push(socket.id)
        connectionSocket.set(user._id.toString(),socketIds)   

        console.log(connectionSocket);

        socket.data.user=user
        next();
  
    } catch (error:any) {
       next(error) 
    }
});

const ChatGateway :chatGateway = new chatGateway()
io.on("connection",(socket:SocketWithUser)=>{
    
ChatGateway.register(socket,getIo())

        const revomeSocket = ()=>{
            let remaningTabs = connectionSocket.get(socket?.data.user?._id?.toString() || "")?.filter((tab)=>{
                return tab!== socket.id
            })
            if(remaningTabs?.length){
            connectionSocket.set(socket?.data.user?._id?.toString()!,remaningTabs)   
            }
            else{
            connectionSocket.delete(socket?.data.user?._id?.toString()!)
            }
            getIo().emit("offline_user",socket?.data.user?._id?.toString())   
            console.log({after:connectionSocket});
                         
        }
            socket.on("disconnect",()=>{
           revomeSocket()
            })
        }
    )

}

const getIo = ()=>{
    if(!io){
        throw new appError("Io not authorization")
    }
    return io
}