import {  ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { Model , HydratedDocument } from "mongoose";

export abstract class dbreposatory<TDocument> {
    constructor(protected readonly model:Model<TDocument>){}
    async create(data:Partial<TDocument>) : Promise<HydratedDocument<TDocument>>{
    return this.model.create(data)
    }

   async findOne(filter:RootFilterQuery<TDocument>, select?:ProjectionType<TDocument>) : Promise<HydratedDocument<TDocument> | null>{
    return this.model.findOne(filter)
    }

    async updateOne(filter:RootFilterQuery<TDocument>, update:UpdateQuery<TDocument>) : Promise<UpdateWriteOpResult>{
    return await this.model.updateOne(filter,update)
    }

    async findById(id:Types.ObjectId | string, projection?:ProjectionType<TDocument>,options?:QueryOptions<TDocument>) : Promise<HydratedDocument<TDocument> | null>{
    return await this.model.findById(id,projection,options)
    }
}