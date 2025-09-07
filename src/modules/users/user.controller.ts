import { Router  } from "express";

import UC from "./user.service"
import { validation } from "../../middleware/validation";
import { signUpSchema } from "./user.validation";

const userRouter = Router()



userRouter.post("/signUp",validation(signUpSchema),UC.signUp)
userRouter.post("/signIn",UC.signIn)

export default userRouter