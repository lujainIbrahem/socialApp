import { Router  } from "express";
import CS from "./comment.service"
import * as CV from "./comment.validation"
import { validation } from "../../middleware/validation";
import { authentication } from "../../middleware/Authentication";

const commentRouter = Router({mergeParams:true})



commentRouter.post("/",authentication(),validation(CV.createCommentSchema),CS.createComment)

export default commentRouter