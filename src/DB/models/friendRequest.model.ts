import mongoose, { HydratedDocument, Schema } from "mongoose"
import { models,Types, model } from "mongoose"


export interface Ifriend{
 createdBy:Types.ObjectId,
 sendTo:Types.ObjectId,
 acceptedAt?:Date
}

const friendRequestSchema = new Schema<Ifriend>({

  acceptedAt:{type:Date},
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User",required:true},
  sendTo:{ type: mongoose.Schema.Types.ObjectId, ref: "User",required:true},
  
}, {   timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true} ,strictQuery:true})

friendRequestSchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"], async function (next) {
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


export const friendRequestModel = models.FriendRequest || model("FriendRequest", friendRequestSchema)
