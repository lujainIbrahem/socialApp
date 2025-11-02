import path, { resolve } from "path"
import dotenv from "dotenv"
dotenv.config({path:path.resolve("./config/.env")})
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import { rateLimit} from "express-rate-limit"
import { appError } from "./utils/classError"
import userRouter from "./modules/users/user.controller"
import checkConnectionDb from "./DB/connectionDB"
import postRouter from "./modules/posts/post.controller"
import { InitializationIo } from "./modules/gateway/gateway"
import chatRouter from "./modules/chat/chat.controller"
import { createHandler } from 'graphql-http/lib/use/express';
import { schemaGQL } from "./modules/graphql/schema.gql"


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


app.all('/graphql', createHandler({ schema:schemaGQL , context :(req)=>({req}) }));

 
    app.use("/user",userRouter)
    app.use("/post",postRouter)
    app.use("/chat",chatRouter)

    /*
    app.get("/upload/*path",async (req:Request,res:Response,next:NextFunction)=>{
        const { path }=req.params as unknown as {path :string[]}
        const key = path.join("/")
        const result = await getFile({ path :key })
        const stream = result.Body as NodeJS.ReadableStream
        res.setHeader("Content-Type",result?.ContentType || "application/octet-stream")
        stream.pipe(res)
    })
  */
   checkConnectionDb()

    app.use("{/*demo}",(req:Request,res:Response,next:NextFunction)=>{
        throw new appError(`InvalidUrl ${req.originalUrl}`,404);
    })

    app.use((err:appError,req:Request,res:Response,next:NextFunction)=>{
        return res.status(err.statusCode as unknown as number || 500 ).json({message:err.message , stack:err.stack})
    })

  const httpServer=  app.listen(port,()=>{
        console.log(`server running in ${port}`);
    })
    
  InitializationIo(httpServer)

}

export default bootstrap 