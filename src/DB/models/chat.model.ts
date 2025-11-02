import { strict } from "assert"
import mongoose, { Schema } from "mongoose"
import { Types } from "mongoose"



export interface IMessage  {
  content: string
  createdBy: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
} 

export interface IChat{
  participants: Types.ObjectId[]
  createdBy: Types.ObjectId
  messages:IMessage[]

  group?:string,
  roomId?:string,

  createdAt: Date
  updatedAt: Date
  
}
const messageSchema = new Schema<IMessage>({
  content: { type: String },
  createdBy:{ type:mongoose.Schema.Types.ObjectId, ref: "User",required:true }
}, {  timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true} })


const chatSchema = new Schema<IChat>({
  participants: [{ type:mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User",required:true},
  
  messages: [messageSchema],
   group: { type:String },
  roomId: { type:String },
 
  
}, {   timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true} ,strictQuery:true})





  const ChatModel = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema)
export default ChatModel