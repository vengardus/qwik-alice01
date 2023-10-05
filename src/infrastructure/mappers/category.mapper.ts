import { type IListCategoryDto } from "~/domain/dtos/category.dto";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { ICategoryEntity } from "~/domain/entity/category.entity";

export class CategoryMapper {

  
  static ListCategoryDtoFromDataResponse(data:IDataResponse):IListCategoryDto {
    return {
      data: data.data as ICategoryEntity[],
      pagination: data.pagination,
      success: data.success,
      message: data.message
    }
  }
}