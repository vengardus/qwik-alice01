import { type IProductEntity } from "~/domain/entity/product.entity"
import { type IDataResponse } from "./app.dto"


export interface IListProductDto extends IDataResponse {
  data: IProductEntity[] | null
}

export interface IRegisterProductDto {
  name: string
  description: string
  price: number
  currency: string
}
