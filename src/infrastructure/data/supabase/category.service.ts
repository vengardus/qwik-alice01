import { type RequestEventBase } from "@builder.io/qwik-city"
import { type ISupabaseResponse, Supabase } from "./supabase"
import type { IRegisterCategoryDto } from "~/domain/dtos/category.dto"
import type { IDataResponse } from "~/domain/dtos/app.dto"


export class CategoryService  {

  constructor(private readonly requestEvent: RequestEventBase) { }
  
  async getAll(): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('categories')
      .select('*')
      .order('name') as ISupabaseResponse

    return {
      data: data.data,
      pagination: null,
      success: data.error ? false : true,
      message: data.error?.message ?? null
    }
  }

  async getAllPagination({ offset = 0, limit = 1 })
    : Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('name', { ascending: true }) as ISupabaseResponse

    return {
      data: data.data,
      pagination: {
        offset,
        count: data.count
      },
      success: data.error ? false : true,
      message: data.error?.message ?? null
    }
  }

  async insert(object: IRegisterCategoryDto): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('categories')
      .insert([object])
      .select() as ISupabaseResponse

    return {
      data: (data.data) ? data.data[0].id : null,
      pagination: null,
      success: (data.status == 201) ? true : false,
      message: data.error?.message ?? ''
    }
  }

  async update(id: number, object: IRegisterCategoryDto): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('categories')
      .update(
        {
          name: object.name,
        }
      )
      .eq('id', id)

    console.log('service-update', data)

    return {
      data: (data.data),
      pagination: null,
      success: (data.status == 204) ? true : false,
      message: data.error?.message ?? ''
    }
  }

  async delete(id: number): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('categories')
      .delete()
      .eq('id', id) as ISupabaseResponse

    return {
      data: (data.data) ? data.data[0].id : null,
      pagination: null,
      success: (data.status == 204) ? true : false,
      message: data.error?.message ?? ''
    }
  }
}
