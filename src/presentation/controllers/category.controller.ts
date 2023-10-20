import { type RequestEventBase } from "@builder.io/qwik-city";
import { CategoryModel } from "~/data/supabase/models/category.model";
import { DBSupabase } from "~/data/supabase/supabase";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import type { IListCategoryDto } from "~/domain/dtos/category.dto";
import { CategoryMapper } from "~/infrastructure/mappers/category.mapper";


export class CategoryController {
  constructor(private requestEvent: RequestEventBase) { }

  async getAll(): Promise<IListCategoryDto> {
    // const oCategoryService = new CategoryService(this.requestEvent)
    // const data = await oCategoryService.getAll()
    const oCategory = new CategoryModel(new DBSupabase(this.requestEvent))
    const data = await oCategory.getAll()

    return CategoryMapper.ListCategoryDtoFromDataResponse(data)
  }

  async getAllPagination({ offset = 0, limit = 0 }: { offset: number, limit: number })
    : Promise<IListCategoryDto> {
    // const oCategoryService = new CategoryService(this.requestEvent)
    // const data = await oCategoryService.getAllPagination({ offset, limit })
    const oCategory = new CategoryModel(new DBSupabase(this.requestEvent))
    const data = await oCategory.getAllPagination({ offset, limit })

    return CategoryMapper.ListCategoryDtoFromDataResponse(data)
  }

  async insert(object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerCategoryDto] = CategoryModel.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    // const oCategoryService = new CategoryService(this.requestEvent)
    // const data = await oCategoryService.insert(registerCategoryDto!)
    const oCategory = new CategoryModel(new DBSupabase(this.requestEvent))
    const data = await oCategory.insert(registerCategoryDto)
    return data
  }

  async update(id: number, object: { [key: string]: any; })
    : Promise<IDataResponse> {
    const [messageError, registerCategoryDto] = CategoryModel.validateObject(object)
    if (messageError) return {
      data: null,
      success: false,
      message: messageError,
      pagination: null
    }
    console.log('update:', messageError, registerCategoryDto)
    // const oCategoryService = new CategoryService(this.requestEvent)
    // const data = await oCategoryService.update(id, registerCategoryDto!)
    const oCategory = new CategoryModel(new DBSupabase(this.requestEvent))
    const data = await oCategory.update(id, registerCategoryDto)

    return data
  }

  async delete(id: number): Promise<IDataResponse> {
    // const oCategoryService = new CategoryService(this.requestEvent)
    // const data = await oCategoryService.delete(id)
    const oCategory = new CategoryModel(new DBSupabase(this.requestEvent))
    const data = await oCategory.delete(id)

    return data
  }
}

