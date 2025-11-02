import { Model  } from "mongoose";
import { dbreposatory } from "./db.repository";
import { Ifriend } from "../models/friendRequest.model";

export class friendRequestRepository extends dbreposatory<Ifriend> {
    constructor(protected readonly model:Model<Ifriend>)
    {super(model)}


}