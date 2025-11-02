import { Model  } from "mongoose";
import { dbreposatory } from "./db.repository";
import { IChat } from "../models/chat.model";

export class chatRepository extends dbreposatory<IChat> {
    constructor(protected override model:Model<IChat>)
    {super(model)}


}