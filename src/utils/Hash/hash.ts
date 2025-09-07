import { hash ,compare } from 'bcrypt';

export const Hash = (plainText:string ,salt_round:number = Number(process.env.SALT_ROUND) )=>{
    return hash( plainText ,salt_round);

}


export const Compare = (plainText:string ,salt_round:string )=>{
    return compare( plainText ,salt_round);

}