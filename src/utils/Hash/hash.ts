import { hash ,compare } from 'bcrypt';

export const Hash =async  (plainText:string ,salt_round:number = Number(process.env.SALT_ROUND) )=>{
    return hash( plainText ,salt_round);
}

export const Compare = async (plainText:string ,salt_round:string )=>{
    return compare( plainText ,salt_round);

}