import { Router  } from "express";
import US from "./user.service"
import * as UC from "./user.validation"
import { validation } from "../../middleware/validation";
import { authentication } from "../../middleware/Authentication";
import { TokenType } from "../../utils/token";
import { allowedExtension, MulterHost } from "../../middleware/multer.cloud";
import { Authorization } from "../../middleware/Authorization";
import { RoleType } from "../../DB/models/user.model";
import chatRouter from "../chat/chat.controller";

const userRouter = Router()

userRouter.use("/:userId/chat",chatRouter)



userRouter.post("/signUp",validation(UC.signUpSchema),US.signUp)

userRouter.patch("/confirmedEmail",validation(UC.confirmedEmailSchema),US.confirmedEmail)

userRouter.post("/login",validation(UC.signInSchema),US.signIn)

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

userRouter.get("/dashBoard",authentication(),Authorization({accessRules:[RoleType.admin,RoleType.superAdmin]}),US.dashBoard)

userRouter.patch("/updateRole/:userId",authentication(),Authorization({accessRules:[RoleType.admin,RoleType.superAdmin]}),US.updateRole)

userRouter.post("/sendRequest/:userId",authentication(),US.sendRequest)

userRouter.patch("/acceptRequest/:requestId",authentication(),US.acceptRequest)

userRouter.post("/upload",
    MulterHost({fileTypes:allowedExtension.image}).single("image"),US.upload)


export default userRouter