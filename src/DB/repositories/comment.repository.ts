import { Model  } from "mongoose";
import { dbreposatory } from "./db.repository";
import { Icomment } from "../models/comment.model";

export class commentRepository extends dbreposatory<Icomment> {
    constructor(protected readonly model:Model<Icomment>)
    {super(model)}


}