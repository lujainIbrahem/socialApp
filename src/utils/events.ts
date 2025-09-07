import { EventEmitter } from "events";
import { generateOTP, sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/templateEmail";

export const eventEmiiter = new EventEmitter()

 eventEmiiter.on("sendEmail",async(data)=>{
const { email } = data
  const otp = await generateOTP()
    const isSend=  await sendEmail({to:email,subject:"confirm Email",html:emailTemplate(otp as unknown as string)})

if (!isSend){
    throw new Error("message not send to email", {cause :400});
}    
 })