import { Model , HydratedDocument } from "mongoose";
import { IUser } from "../models/user.model";
import { dbreposatory } from "./db.repository";

export class UserRepository extends dbreposatory<IUser> {
    constructor(protected readonly model:Model<IUser>)
    {super(model)}

    async createOneUser(data:Partial<IUser>) : Promise<HydratedDocument<IUser>>{
        const user:HydratedDocument<IUser> = await this.model.create(data)
        if(!user){
            throw new Error("fail to create");
            
        }
        return user
    }


}