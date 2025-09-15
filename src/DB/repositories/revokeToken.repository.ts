import { Model  } from "mongoose";
import { dbreposatory } from "./db.repository";
import { IRevokeToken } from "../models/revokeToken.model";

export class RevokeTokenRepository extends dbreposatory<IRevokeToken> {
    constructor(protected readonly model:Model<IRevokeToken>)
    {super(model)}


}