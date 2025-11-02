import { NextFunction, Request, Response } from "express"
import { appError } from "../../utils/classError"
import { createCommentSchemaType, createCommentSchemaTypee } from "./comment.validation"
import { postRepository } from "../../DB/repositories/post.repository"
import { allowCommentEnum, IPost, PostModel } from "../../DB/models/post.model"
import userModel from "../../DB/models/user.model"
import { UserRepository } from "../../DB/repositories/user.repository"
import { commentRepository } from "../../DB/repositories/comment.repository"
import { CommentModel, Icomment, onModelEnum } from "../../DB/models/comment.model"
import { availability } from "../../utils/avalibility"
import { HydratedDocument, Types } from "mongoose"


class commentService {
    private _postmodel = new postRepository(PostModel)
    private _userModel = new UserRepository(userModel)
    private _commentModel = new commentRepository(CommentModel)

    constructor(){}


    //==================createComment========================

    createComment = async (req:Request,res:Response,next:NextFunction)=>{
    const {postId , commentId} :createCommentSchemaTypee = req.params as createCommentSchemaTypee
    const {content,tags,onModel}:createCommentSchemaType = req.body

    let doc :HydratedDocument<IPost | Icomment> | null =null
    //reply
    if ( onModel == onModelEnum.Comment){
      if(!commentId)    {throw new appError("commentId required",404)}

      const comment = await this._commentModel.findOne(
        {
          _id:commentId,
          refId:postId
        },undefined,
        {
          populate:{
            path:"refId",
            match:{
              allowComment:allowCommentEnum.allow,
                 $or:availability(req)
            }
          }
        }
      )
      if(!comment?.refId)    {  throw new appError("comment not found",404)}
doc=comment
    }
//comment
else if(onModel == onModelEnum.Post){
  if(commentId)    {throw new appError("commentId is not allowed",404)}

    const post = await this._postmodel.findOne({
        _id:postId,
        allowComment:allowCommentEnum.allow,
        $or:availability(req)
        })
    if(!post)
    {throw new appError("no posts found",404)}
    doc= post
}
    if(!content)
    {   throw new appError("content not exist")  }

    if(req?.body?.tags?.length && 
      (await this._userModel.find(
        {filter:{_id:{ $in :req?.body?.tags }}})).length !== req?.body?.tags?.length )
      {throw new appError("invalid userId ",400)}

    const comment= await this._commentModel.create({
      content,
      tags: tags as unknown as Types.ObjectId[],
      refId :doc?._id as unknown as Types.ObjectId,
      onModel

    })
  
    return res.status(201).json({message:"created",comment})

    }

    
}



export default new commentService()
