import { type ICategoryEntity } from "~/domain/entity/category.entity"
import { type IDataResponse } from "./app.dto"


export interface IListCategoryDto extends IDataResponse {
  data: ICategoryEntity[]
}

export interface IRegisterCategoryDto {
  name: string
}
