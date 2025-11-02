import { Router } from "express"
import { chatService } from "./chat.service"
import { authentication } from "../../middleware/Authentication"
import multer from "multer"

const chatRouter = Router({mergeParams:true})
const CS = new chatService


chatRouter.get("/" ,authentication(), CS.getChat)
chatRouter.get("/group/:groupId" ,authentication(), CS.getGroupChat)

chatRouter.post("/group" ,authentication(), CS.createGroupChat)

export default chatRouter