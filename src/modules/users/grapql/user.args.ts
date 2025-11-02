import { GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql"
import { GenderType } from "../../../DB/models/user.model"

export const userArgs = {
    fName:{type:new GraphQLNonNull(GraphQLString)},
    lName:{type:new GraphQLNonNull(GraphQLString)},
    email:{type:new GraphQLNonNull(GraphQLString)},
    password:{type:new GraphQLNonNull(GraphQLString)},
    age:{type:new GraphQLNonNull(GraphQLInt)},
    gender:{
      type:new GraphQLNonNull(new GraphQLEnumType({
      name:"GenderType",
      values:{
        male:{value:GenderType.male},
        female:{value:GenderType.female}
      }
    }))
      },
      }