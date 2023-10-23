import { type IEntity } from "../core/interfaces/entity.interface"

export interface IProductEntity extends IEntity{
     // id: number
     name: string 
     description:string 
     price: number 
     currency: string 
}
