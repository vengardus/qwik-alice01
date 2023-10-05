import { type RequestEventBase } from "@builder.io/qwik-city";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { Product } from "~/domain/model/product.model";
import { ProductService } from "~/infrastructure/data/supabase/product.service";
import { ProductMapper } from "~/infrastructure/mappers/product.mapper";


export class ProductController {
  constructor(private requestEvent: RequestEventBase) { }

  async getAll(): Promise<IListProductDto> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.getAll()

    return ProductMapper.ListProductDtoFromDataResponse(data)
  }

  async getAllPagination({ offset = 0, limit = 0 }: { offset: number, limit: number })
    : Promise<IListProductDto> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.getAllPagination({ offset, limit })
    console.log('controller', data)
    return ProductMapper.ListProductDtoFromDataResponse(data)
  }

  async insert(object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerProductDto] = Product.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.insert(registerProductDto!)
    return data
  }

  async update(id: number, object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerProductDto] = Product.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.update(id, registerProductDto!)

    return data
  }

  async delete(id: number): Promise<IDataResponse> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.delete(id)

    return data
  }
}

