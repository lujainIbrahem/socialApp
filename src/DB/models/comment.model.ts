import mongoose, { HydratedDocument, Schema } from "mongoose"
import { model } from "mongoose"
import { models } from "mongoose"
import { Types } from "mongoose"
import { IPost } from "./post.model"


export enum onModelEnum {
  Post = "Post",
  Comment = "Comment",
}

export interface Icomment{
  content?: string
  likes?:Types.ObjectId[]
  tags?: Types.ObjectId[]

refId: Types.ObjectId 
  onModel:onModelEnum

  deletedAt?:Date
  deletedBy?: Types.ObjectId
  restoredAt?:Date
  restoredBy?: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const commentSchema = new Schema<Icomment>({
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  refId:{type: mongoose.Schema.Types.ObjectId, refPath: "onModel", required: true},
  onModel:{type: String,enum:onModelEnum, required: true },


  deletedAt:{type:Date},
  deletedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
  restoredAt:{type:Date},
  restoredBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
  
}, {   timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true} ,strictQuery:true})

commentSchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"], async function (next) {
  const query = this.getQuery()
  console.log(query)
const {paranoid , ...rest} =query
if (paranoid === false){
  this.setQuery({...rest })
} else {
  this.setQuery({...rest, deletedAt:{$exists:false}})
}
  next()
})


commentSchema.virtual("replies",{
  ref:"Comment",
  localField:"_id",
  foreignField:"commentId"
})



export const CommentModel = models.Comment || model("Comment", commentSchema)
