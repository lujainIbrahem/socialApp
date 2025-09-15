import { Router  } from "express";
import US from "./user.service"
import * as UC from "./user.validation"
import { validation } from "../../middleware/validation";
import { authentication } from "../../middleware/Authentication";
import { TokenType } from "../../utils/token";

const userRouter = Router()



userRouter.post("/signUp",validation(UC.signUpSchema),US.signUp)

userRouter.patch("/confirmedEmail",validation(UC.confirmedEmailSchema),US.confirmedEmail)

userRouter.post("/signIn",validation(UC.signInSchema),US.signIn)

userRouter.get("/profile",authentication(),US.getProfile)

userRouter.post("/logout",authentication(),validation(UC.logOutSchema),US.logout)

userRouter.post("/loginWithGmail",validation(UC.loginWithGmailSchema),US.loginWithGmail)

userRouter.get("/refreshToken",authentication(TokenType.refresh),US.refreshToken)

userRouter.patch("/forgetPassword",validation(UC.forgetPasswordSchema),US.forgetPassword)

userRouter.patch("/resetPassword",validation(UC.resetPasswordSchema),US.resetPassword)

userRouter.patch("/updatePassword",validation(UC.updatePasswordSchema),authentication(),US.updatePassword)

userRouter.patch("/updateEmail",validation(UC.updateEmailSchema),US.updateEmail)

userRouter.patch("/updateProfileInfo",validation(UC.updateProfileSchema),authentication(),US.updateProfileInfo)

userRouter.patch("/updateEmailTags",validation(UC.updateEmailTagsSchema),US.updateEmailTags)

userRouter.post("/stepOneVerification",validation(UC.stepOneVerificationSchema),US.stepOneVerification)

userRouter.post("/stepTwoVerification",validation(UC.stepTwoVerificationSchema),US.stepTwoVerification)

export default userRouter