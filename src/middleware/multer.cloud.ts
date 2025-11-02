import multer, { FileFilterCallback } from "multer"
import { Request } from "express"
import { appError } from "../utils/classError"
import os from "node:os"
import {v4 as uuidv4 } from "uuid"

export const allowedExtension ={
  image :["image/png","image/jpeg","image/webp"],
  video:["video/mp4"],
  pdf:["application/pdf"]
}
export enum storageEnum {
   disk= "disk",
   cloud= "cloud"
}

export const MulterHost = ({
fileTypes= allowedExtension.image,
storageType =storageEnum.cloud,
maxSize=5
}:{
    fileTypes?:string[],
    storageType?:storageEnum,
    maxSize?:number
})  => {

  
const storage = storageType ===storageEnum.cloud? multer.memoryStorage() :multer.diskStorage({
     destination: os.tmpdir(), 
    filename(req:Request, file:Express.Multer.File, cb){
  cb(null,`${uuidv4()}_${file.originalname}`)

    }
})

function fileFilter (req:Request, file:Express.Multer.File, cb:FileFilterCallback) {

  if(fileTypes.includes(file.mimetype)){
  cb(null,true)
  }else{
  return cb(new appError ("Invalid file",400))

  }
}

const upload = multer({ storage,limits:{fileSize:1024 * 1024 *maxSize},fileFilter })
return upload


}