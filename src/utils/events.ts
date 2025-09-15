import { EventEmitter } from "events";
import { sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/templateEmail";

export const eventEmiiter = new EventEmitter()

 eventEmiiter.on("sendEmail",async(data)=>{
  const { email,otp } = data
  await sendEmail({
    to:email,
    subject:"confirm Email",
    html:emailTemplate(otp)
  })

 })


 
 eventEmiiter.on("forgetPassword",async(data)=>{
  const { email,otp } = data
  await sendEmail({
    to:email,
    subject:"confirm Email",
    html:emailTemplate(otp)
  })

 })