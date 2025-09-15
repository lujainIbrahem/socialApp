import { NextFunction, Request, Response } from "express"
import postmodel from "../../DB/models/post.model"
import { postRepository } from "../../DB/repositories/post.repository"
import { appError } from "../../utils/classError"
import { createPostSchemaType, likePostSchemaType, unLikePostSchemaType } from "./post.validation"



class postService {
    private _postmodel = new postRepository(postmodel)

    constructor(){}


    //==================createPost========================

    createPost = async (req:Request,res:Response,next:NextFunction)=>{
    const {content}:createPostSchemaType = req.body
    if(!content)
    {   throw new appError("content not exist")  }    

    const post = await this._postmodel.create({content,userId: req.user!._id })

    return res.status(201).json({message:"success", post})

    }


//======================== likePost =====================
likePost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId } :likePostSchemaType= req.body;

    const post = await this._postmodel.findById(postId);
    if (!post) {
      throw new appError("Post not found", 404);
    }


    post.likes.push(req?.user?._id!);
    await this._postmodel.updateOne({id:post?._id},{post})

    return res.status(200).json({
      message: "Post liked successfully",
    });
  
};

//======================== unLikePost =====================
unLikePost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId } :unLikePostSchemaType= req.body;

    const post = await this._postmodel.findById(postId);
    if (!post) {
      throw new appError("Post not found", 404);
    }
    await this._postmodel.updateOne({_id:post?._id},  { $pull: { likes: req?.user?._id } })

    return res.status(200).json({message: "Post unliked successfully"});
  
}


} 


    

    
    



export default new postService()
