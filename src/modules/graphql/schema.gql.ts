import { GraphQLObjectType, GraphQLSchema, } from "graphql"

import UserFields from "../users/grapql/user.field";



export const schemaGQL = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
    ...UserFields.query()
    },
  }),
  mutation: new GraphQLObjectType({
    name:"mutation",
    fields:
    { 
    ...UserFields.mutation()
},

})
});