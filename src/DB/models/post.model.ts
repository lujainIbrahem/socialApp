import mongoose, { Schema } from "mongoose"
import { Types } from "mongoose"

export enum availabilityEnum {
  private = "private",
  public = "public",
  friends = "friends"
}

export enum allowCommentEnum {
  allow = "allow",
  deny = "deny",
}

export interface IPost{
  content: string
  userId: Types.ObjectId
  tags:Types.ObjectId[]
  deletedAt?:Date
  deletedBy?:Types.ObjectId
  restoredAt?:Date
  restoredBy?:Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
  availability:availabilityEnum
  allowComment:allowCommentEnum
  
}

export interface IPostLike  {
  postId: Types.ObjectId
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const postSchema = new Schema<IPost>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  availability: { type: String, enum:availabilityEnum , default:availabilityEnum.public },
  allowComment: { type: String, enum:allowCommentEnum , default:allowCommentEnum.allow },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  deletedAt:{type:Date},
  deletedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
  restoredAt:{type:Date},
  restoredBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
  
}, {   timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true} ,strictQuery:true})

const postLikeSchema = new Schema<IPostLike>({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {  timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true} })

postSchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"],function (next) {
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


postSchema.virtual("comments",{
  ref:"Comment",
  localField:"_id",
  foreignField:"postId"
})




export const PostModel = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema)
export const PostLikeModel = mongoose.models.PostLike || mongoose.model<IPostLike>("PostLike", postLikeSchema)
