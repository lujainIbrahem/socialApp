import { Model  } from "mongoose";
import { dbreposatory } from "./db.repository";
import { IPost } from "../models/post.model";

export class postRepository extends dbreposatory<IPost> {
    constructor(protected readonly model:Model<IPost>)
    {super(model)}


}