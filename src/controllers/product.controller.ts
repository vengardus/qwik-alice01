import { type RequestEventBase } from "@builder.io/qwik-city";
import { AppConfig } from "~/domain/app.config";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { Product } from "~/domain/model/product.model";
import { ProductService } from "~/infrastructure/data/supabase/product.service";
import { ProductMapper } from "~/infrastructure/mappers/product.mapper";


export class ProductController {
  private pagination = {
    offset: 0,
    limit: AppConfig.PAGINATION.limit,
    count: 0
  }

  constructor(private requestEvent: RequestEventBase) { }

  setPagination(offset = 0, limit = 1, count = 0) {
    this.pagination.offset = offset
    this.pagination.limit = limit
    this.pagination.count = count
  }
  async getAll(): Promise<IListProductDto> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.getAll()

    return ProductMapper.ListProductDtoFromDataResponse(data)
  }

  async getAllPagination({ offset = 0, limit = 0 }: { offset: number, limit: number }): Promise<IListProductDto> {
    const oProductService = new ProductService(this.requestEvent)
    console.log('controller.getallPagination:', offset, limit)
    const data = await oProductService.getAllPagination({ offset, limit })

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
      dataRefresh: data.success ? await this.getAllPagination({
        offset: this.pagination.offset,
        limit: this.pagination.limit
      }) : null
      // dataRefresh: data.success ? await this.getAll() : null
    }
  }

  async insert2(object: { [key: string]: any; }):
    Promise<IDataResponse> {
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

  async delete(id: number):
    Promise<{
      dataResponse: IDataResponse,
      dataRefresh: IListProductDto | null
    }> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.delete(id)
    return {
      dataResponse: data,
      dataRefresh: data.success ? await this.getAllPagination({ offset: 0, limit: 30 }) : null
    }
  }

  async delete2(id: number):Promise<IDataResponse> {
    const oProductService = new ProductService(this.requestEvent)
    const data = await oProductService.delete(id)
    return data
  }
}

