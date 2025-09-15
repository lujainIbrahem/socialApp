import mongoose, { Types } from 'mongoose';


export interface IRevokeToken {
    userId:Types.ObjectId,
    tokenId:string,
    expireAt:Date
  
}

const revokenTokenSchema = new mongoose.Schema<IRevokeToken>({
 userId:{type :mongoose.Schema.Types.ObjectId , required:true,ref:"User"},
    tokenId:{type:String , required:true},
    expireAt:{type:Date , required:true}
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},

});


const revokenTokenmodel =mongoose.models.RevokeToken || mongoose.model<IRevokeToken>('RevokeToken', revokenTokenSchema);


export default revokenTokenmodel