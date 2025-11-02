import { Model  } from "mongoose";
import { dbreposatory } from "./db.repository";
import { IPostLike } from "../models/post.model";

export class postLikeRepository extends dbreposatory<IPostLike> {
    constructor(protected readonly model:Model<IPostLike>)
    {super(model)}


}