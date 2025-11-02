import { NextFunction, Request, Response } from "express"
import { postRepository } from "../../DB/repositories/post.repository"
import { appError } from "../../utils/classError"
import { createPostSchemaType, likePostSchemaType, unLikePostSchemaType, updatePostSchemaType } from "./post.validation"
import { postLikeRepository } from '../../DB/repositories/postLike.repository';
import {  PostLikeModel, PostModel } from "../../DB/models/post.model";
import mongoose from "mongoose";
import userModel from "../../DB/models/user.model";
import { UserRepository } from "../../DB/repositories/user.repository";
import { availability } from "../../utils/avalibility";



class postService {
    private _postmodel = new postRepository(PostModel)
    private _postLikemodel = new postLikeRepository(PostLikeModel)
    private _userModel = new UserRepository(userModel)


    constructor(){}


    //==================createPost========================

    createPost = async (req:Request,res:Response,next:NextFunction)=>{
    const {content,tags}:createPostSchemaType = req.body
    if(!content)
    {   throw new appError("content not exist")  }    
    if(req?.body?.tags?.length && 
      (await this._userModel.find({filter:{_id:{ $in :req?.body?.tags }}})).length !== req?.body?.tags?.length )
      {throw new appError("invalid userId ",400)}

    const post = await this._postmodel.create({
      ...req.body,
      userId: req?.user?._id!
     })

    return res.status(201).json({message:"success", post})

    }

      //==================getSinglePost========================

    getSinglePost = async (req:Request,res:Response,next:NextFunction)=>{


      const {id}= req.params
      if(!id){
        throw new appError("id not exist")
      }
      const posts = await this._postmodel.findOne({ userId:id });
      if(!posts){throw new appError("no posts found")}
    return res.status(201).json({message:"success",posts})

    }

    
      //====================deletePost======================

    deletePost = async (req:Request,res:Response,next:NextFunction)=>{


      const {id}= req.params
      if(!id){
        throw new appError("id not exist",400)
      }
      const posts = await this._postmodel.findOne({ _id:id });
      if(!posts){throw new appError("no posts found")}

      await this._postmodel.deleteOne({_id:id})
      
    return res.status(200).json({message:"success"})

    }

    //====================updatePost======================

    updatePost = async (req:Request,res:Response,next:NextFunction)=>{

      const {postId}:likePostSchemaType = req.params as likePostSchemaType
      const post = await this._postmodel.findOne({
      _id:postId,
      userId: req?.user?._id!,
      paranoid:false
      })
      if(!post)
        {throw new appError("no posts found",404)}

      if(req?.body?.content){
        post.content = req.body.content
      }
      
      if(req?.body?.availability){
        post.availability = req.body.availability
      }

       if(req?.body?.allowComment){
        post.allowComment = req.body.allowComment
      }

      if(req?.body?.tags?.length ){
      if(req?.body?.tags?.length && 
      (await this._userModel.find({filter:{_id:{ $in :req?.body?.tags }}})).length !== req?.body?.tags?.length )
      {throw new appError("invalid userId ",400)}
    post.tags =req.body.tags

    }
    await post.save()
     
    return res.status(200).json({message: "Post updated successfully",post});
  }

    //==================getAllPosts========================

    getAllPosts = async (req:Request,res:Response,next:NextFunction)=>{
/*
      let {page = 1 ,limit = 3 } =req.query as unknown as {page:number ,limit:number} 
      const {countDocument,cuttentPage,document,numberOfPages} = await this._postmodel.paginate({filter:{} ,query:{page,limit}})
*/ 
const post = await this._postmodel.find({filter:{}, options:{
  populate:[
    {
      path:"comments",
      match:{
        commentId:{$exists:false}
      },
      //addtoSet
populate:{
 path:"replies",
      }
    }
  ]
}})
return res.status(200).json({message: "successfully" ,post});
  
    }


//======================== likePost =====================
likePost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId } :likePostSchemaType= req.params as likePostSchemaType

    const post = await this._postmodel.findOneAndUpdate({
      _id:postId,
      $or:availability(req)
    },
     { $set: { updatedAt: new Date() } },
  { new: true }
  );
    if (!post) {
      throw new appError("Post not found", 404);
    }
    
    const alreadyLiked =await this._postLikemodel.findOne({postId,
      userId:req.user?._id
    })
    if(alreadyLiked){
      throw new appError("you already liked before", 404);
    }
  await this._postLikemodel.create({ postId:new mongoose.Types.ObjectId(postId),
    userId: req?.user?._id!
   })
    return res.status(200).json({
      message: "Post liked successfully"
    });
  
};



//======================== listLikesPost =====================
listLikesPost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId } :likePostSchemaType= req.body;


    const post = await this._postmodel.findById(postId);
    if (!post) {
      throw new appError("Post not found", 404);
    }
  
 //const likes = await this._postLikemodel.find({ postId }) 
  //.populate("userId", "name email -_id")
  //.exec();


///console.log(likes);

  
    return res.status(200).json({
      message: "Post liked successfully"
    });
  
};

//======================== unLikePost =====================
unLikePost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId } :unLikePostSchemaType= req.body;

    const post = await this._postmodel.findById(postId);
    if (!post) {
      throw new appError("Post not found", 404);
    }
    const alreadyLiked =await this._postLikemodel.findOne({postId,
      userId:req.user?._id
    })
    if(!alreadyLiked){
      throw new appError("you must be like first", 404);
    }

 await this._postLikemodel.deleteOne({
  postId,
    userId: req?.user?._id!
 })

    return res.status(200).json({
      message: "Post unliked successfully",

    });
  
};



} 


    

    
    



export default new postService()
