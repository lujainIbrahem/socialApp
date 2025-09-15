import mongoose, { Types } from 'mongoose';


export interface IPost {
  content: string,
  userId: mongoose.Types.ObjectId,
  likes: mongoose.Types.ObjectId[],
createdAt:Date,
  updatedAt:Date

  
}

const postSchema = new mongoose.Schema<IPost>({
 userId:{type :mongoose.Schema.Types.ObjectId , required:true,ref:"User"},
    likes:[{type:mongoose.Schema.Types.ObjectId ,ref:"User"}],
    content:{type:String,required:true}
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},

});


const postmodel =mongoose.models.posts || mongoose.model<IPost>('posts', postSchema);


export default postmodel