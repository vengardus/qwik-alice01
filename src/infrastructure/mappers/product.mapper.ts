import { type IListProductDto } from "~/domain/dtos/product.dto";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IProductEntity } from "~/domain/entity/product.entity";

export class ProductMapper {

  
  static ListProductDtoFromDataResponse(data:IDataResponse):IListProductDto {
    return {
      data: data.data as IProductEntity[],
      pagination: data.pagination,
      success: data.success,
      message: data.message
    }
  }
}