import { HydratedDocument } from "mongoose"
import { JwtPayload } from "jsonwebtoken"
import { IUser } from "../../DB/models/user.model"
import { Socket } from "socket.io"

export interface SocketWithUser extends Socket{
    user?:Partial<HydratedDocument<IUser>>
    decoded?:JwtPayload
}