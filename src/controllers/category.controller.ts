import { type RequestEventBase } from "@builder.io/qwik-city";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IListCategoryDto } from "~/domain/dtos/category.dto";
import { Category } from "~/domain/model/category.model";
import { CategoryService } from "~/infrastructure/data/supabase/category.service";
import { CategoryMapper } from "~/infrastructure/mappers/category.mapper";


export class CategoryController {
  constructor(private requestEvent: RequestEventBase) { }

  async getAll(): Promise<IListCategoryDto> {
    const oCategoryService = new CategoryService(this.requestEvent)
    const data = await oCategoryService.getAll()

    return CategoryMapper.ListCategoryDtoFromDataResponse(data)
  }

  async getAllPagination({ offset = 0, limit = 0 }: { offset: number, limit: number })
    : Promise<IListCategoryDto> {
    const oCategoryService = new CategoryService(this.requestEvent)
    const data = await oCategoryService.getAllPagination({ offset, limit })

    return CategoryMapper.ListCategoryDtoFromDataResponse(data)
  }

  async insert(object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerCategoryDto] = Category.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    const oCategoryService = new CategoryService(this.requestEvent)
    const data = await oCategoryService.insert(registerCategoryDto!)
    return data
  }

  async update(id: number, object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerCategoryDto] = Category.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    const oCategoryService = new CategoryService(this.requestEvent)
    const data = await oCategoryService.update(id, registerCategoryDto!)

    return data
  }

  async delete(id: number): Promise<IDataResponse> {
    const oCategoryService = new CategoryService(this.requestEvent)
    const data = await oCategoryService.delete(id)

    return data
  }
}

