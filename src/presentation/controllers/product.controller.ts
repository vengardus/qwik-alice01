import { type RequestEventBase } from "@builder.io/qwik-city";
import { ProductModel } from "~/data/supabase/models/product.model";
import { DBSupabase } from "~/data/supabase/supabase";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { ProductMapper } from "~/infrastructure/mappers/product.mapper";


export class ProductController {
  constructor(private requestEvent: RequestEventBase) { }

  async getAll(): Promise<IListProductDto> {
    // const oProductService = new ProductService(this.requestEvent)
    // const data = await oProductService.getAll()
    const oProduct = new ProductModel(new DBSupabase(this.requestEvent))
    const data = await oProduct.getAll()

    return ProductMapper.ListProductDtoFromDataResponse(data)
  }

  async getAllPagination({ offset = 0, limit = 0 }: { offset: number, limit: number })
    : Promise<IListProductDto> {
    // const oProductService = new ProductService(this.requestEvent)
    // const data = await oProductService.getAllPagination({ offset, limit })
    const oProduct = new ProductModel(new DBSupabase(this.requestEvent))
    const data = await oProduct.getAllPagination({ offset, limit })

    return ProductMapper.ListProductDtoFromDataResponse(data)
  }

  async insert(object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerProductDto] = ProductModel.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    // const oProductService = new ProductService(this.requestEvent)
    // const data = await oProductService.insert(registerProductDto!)
    const oProduct = new ProductModel(new DBSupabase(this.requestEvent))
    const data = await oProduct.insert(registerProductDto!)
    return data
  }

  async update(id: number, object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerProductDto] = ProductModel.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    // const oProductService = new ProductService(this.requestEvent)
    // const data = await oProductService.update(id, registerProductDto!)
    const oProduct = new ProductModel(new DBSupabase(this.requestEvent))
    const data = await oProduct.update(id, registerProductDto!)

    return data
  }

  async delete(id: number): Promise<IDataResponse> {
    // const oProductService = new ProductService(this.requestEvent)
    // const data = await oProductService.delete(id)
    const oProduct = new ProductModel(new DBSupabase(this.requestEvent))
    const data = await oProduct.delete(id)

    return data
  }
}

