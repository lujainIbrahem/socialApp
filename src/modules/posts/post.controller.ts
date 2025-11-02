import { Router  } from "express";
import PS from "./post.service"
import * as PC from "./post.validation"
import { validation } from "../../middleware/validation";
import { authentication } from "../../middleware/Authentication";
import commentRouter from "../comment/comment.controller";

const postRouter = Router()

postRouter.use("/:postId/comments{/:commentId/reply}",commentRouter)

postRouter.post("/createPost",authentication(),validation(PC.createPostSchema),PS.createPost)

postRouter.get("/getPosts",PS.getSinglePost)
postRouter.get("/",PS.getAllPosts)

postRouter.delete("/deletePost/:id",authentication(),PS.deletePost)

postRouter.patch("/updatePost/:postId",authentication(),PS.updatePost)

postRouter.post("/likePost/:postId",authentication(),validation(PC.likePostSchema),PS.likePost)

postRouter.get("/listLikesPost",authentication(),validation(PC.likePostSchema),PS.listLikesPost)

postRouter.post("/unLikePost",authentication(),validation(PC.likePostSchema),PS.unLikePost)

export default postRouter