import { type RequestEventBase } from "@builder.io/qwik-city";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { Product } from "~/domain/model/product.model";
import { ProductService } from "~/infrastructure/data/supabase/product.service";
import { ProductMapper } from "~/infrastructure/mappers/product.mapper";


export class ProductController {

  constructor(private readonly requestEvent: RequestEventBase) { }

  async getAllPagination({offset=0, limit=0}:{offset?:number, limit?:number}): Promise<IListProductDto> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.getAllPagination({offset, limit})
    
    return ProductMapper.ListProductDtoFromDataResponse(data)
  }

  async insert(object: { [key: string]: any; }):
    Promise<{
      dataResponse: IDataResponse,
      dataRefresh: IListProductDto | null
    }> {
    const [messageError, registerProductDto] = Product.validateObject(object)
    if (messageError) return {
      dataResponse: {
        data: null,
        success: false,
        message: messageError,
        pagination: null
      },
      dataRefresh: null
    }

    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.insert(registerProductDto!)
    return {
      dataResponse: data,
      dataRefresh: data.success ? await this.getAllPagination({}) : null
    }
  }

  async delete(id: number):
    Promise<{
      dataResponse: IDataResponse,
      dataRefresh: IListProductDto | null
    }> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.delete(id)
    return {
      dataResponse: data,
      dataRefresh: data.success ? await this.getAllPagination({}) : null
    }
  }
}

