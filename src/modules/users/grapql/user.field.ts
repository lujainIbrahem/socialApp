import { GraphQLList, GraphQLString } from "graphql"
import { GenderType } from "../../../DB/models/user.model"
import { userType } from "./user.type";
import userService from "../user.service";
import { userArgs } from "./user.args";

class UserFields {
  constructor(){}

query =()=>{
return {
    getUsers: {
        type: new GraphQLList(userType),
        resolve: userService.getUsers

      },
        }
    };

mutation =()=>{
      return {
           createUser:{
      type:userType,
      args:userArgs,
 resolve: userService.createUser
  }
      }
    }

}
export default new UserFields()