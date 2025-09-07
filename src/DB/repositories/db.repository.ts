import { ProjectionType, RootFilterQuery } from "mongoose";
import { Model , HydratedDocument } from "mongoose";

export abstract class dbreposatory<TDocument> {
    constructor(protected readonly model:Model<TDocument>){}
    async create(data:Partial<TDocument>) : Promise<HydratedDocument<TDocument>>{
    return this.model.create(data)
    }

   async findOne(filter:RootFilterQuery<TDocument>, select?:ProjectionType<TDocument>) : Promise<HydratedDocument<TDocument> | null>{

    return this.model.findOne(filter)

    }



}