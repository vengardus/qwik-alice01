import { type IEntity } from "../core/interfaces/entity.interface";

export interface IUserEntity extends IEntity{
    //id: number,
    uid: string,
    username:string,
    password:string,
    email:string,
    role:string
}