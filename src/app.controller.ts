import path from "path"
import dotenv from "dotenv"
dotenv.config({path:path.resolve("./config/.env")})
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import { rateLimit} from "express-rate-limit"
import { appError } from "./utils/classError"
import userRouter from "./modules/users/user.controller"
import checkConnectionDb from "./DB/connectionDB"


const port : string | number = process.env.PORT || 5000

const app : express.Application =express()

const Limiter = rateLimit ({
    windowMs:5*60*1000,
    limit:10,
    message:{
        error:"Game Over "
    },
    statusCode:429,
    legacyHeaders:false
})

const bootstrap = () => {

    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(Limiter)

    app.get("/",(req:Request,res:Response,next:NextFunction)=>{
        return res.status(200).json({message:"welcome to socialApp"})
    })


    app.use("/user",userRouter)
  
   checkConnectionDb()

    app.use("{/*demo}",(req:Request,res:Response,next:NextFunction)=>{
        throw new appError(`InvalidUrl ${req.originalUrl}`,404);
    })

    app.use((err:appError,req:Request,res:Response,next:NextFunction)=>{
        return res.status(err.statusCode as unknown as number || 500 ).json({message:err.message , stack:err.stack})
    })

    app.listen(port,()=>{
        console.log(`server running in ${port}`);
    })

}

export default bootstrap 