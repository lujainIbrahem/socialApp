import mongoose, { Types } from 'mongoose';

export enum GenderType {
    male = "male",
    female = "female",
}

export enum RoleType {
    user = "user",
    admin = "admin", 
}

export enum userProvider  {
   
   system ="system",
   google ="google"
}

export interface IUser {
  _id:Types.ObjectId,
  fName: string,
  lName:string,
  userName?:string,
  email: string,
  password:string,
  age:number,
  address?:string,
  phone?:string,
  role?:RoleType,
  otp?:string,
  image?:string,
  provider:userProvider,
  confirmed?:boolean,
  changeCredentails?:Date
  gender:GenderType,
  createdAt:Date,
  updatedAt:Date
  
}

const userSchema = new mongoose.Schema<IUser>({
  fName: {type:String,required:true,minlength:2,trim:true},
  lName:{type:String,required:true,minlength:2,trim:true},
  email: {type:String,required:true,unique:true,trim:true},
  password:{type:String, trim:true,required: function () {
    return this.provider===userProvider.google? false : true
  }},
  age:{type:Number,min:18,max:60, required: function () {
    return this.provider===userProvider.google? false : true}},
  address:{type:String},
  phone:{type:String},
  otp:{type:String},
  image:{type:String},
  provider:{type:String, enum:userProvider, default:userProvider.system},
  confirmed:{ type:Boolean,default:false},
  changeCredentails:{type :Date},
  role:{type:String,enum:RoleType,default:RoleType.user},
  gender:{type:String,enum:GenderType,required:true},
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},

});

userSchema.virtual("userName").set(function(value){
    const [fName,lName]=value.split(" ")
    this.set({fName,lName})

}).get(function(){
    return this.fName + " " + this.lName
})

const userModel =mongoose.models.User || mongoose.model<IUser>('User', userSchema);


export default userModel