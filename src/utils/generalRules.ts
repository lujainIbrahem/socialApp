import mongoose from "mongoose";
import z from "zod";

export const generalRules ={
    id:z.string().refine((value) => {
        return mongoose.Types.ObjectId.isValid(value)
    },{message:"Invalid user id"}),
    email:z.email(),
    password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    otp:z.string().regex(/^\d{6}$/).trim()

}