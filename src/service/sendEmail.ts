import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export const sendEmail = async (mailOptions: Mail.Options)=>{
    
 const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  service:"gmail", 
  auth: {
    user: process.env.EMAIL,
    pass:process.env.PASS,
  },
});

  const info = await transporter.sendMail({
    from: `"lojy" ${process.env.EMAIL}`,
    ...mailOptions
  });
  if (info.accepted.length>0){
    return true
  }
  else{
    return false
  }

};
export const generateOTP = async () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
}
