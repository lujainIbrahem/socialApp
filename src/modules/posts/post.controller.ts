import { Router  } from "express";
import PS from "./post.service"
import * as PC from "./post.validation"
import { validation } from "../../middleware/validation";
import { authentication } from "../../middleware/Authentication";

const postRouter = Router()



postRouter.post("/createPost",authentication(),validation(PC.createPostSchema),PS.createPost)

postRouter.post("/likePost",authentication(),validation(PC.likePostSchema),PS.likePost)

postRouter.post("/unLikePost",authentication(),validation(PC.likePostSchema),PS.unLikePost)

export default postRouter