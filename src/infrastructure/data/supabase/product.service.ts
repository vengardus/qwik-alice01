import { type RequestEventBase } from "@builder.io/qwik-city"
import { type ISupabaseResponse, Supabase } from "./supabase"
import type { IRegisterProductDto } from "~/domain/dtos/product.dto"
import type { IDataResponse } from "~/domain/dtos/app.dto"


export class ProductService {

  constructor(private readonly requestEvent: RequestEventBase) { }

  async getAll(): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
          .from('products')
          .select('*')
          .order('id') as ISupabaseResponse

    return {
      data: data.data,
      pagination: null,
      success: data.error ? false : true,
      message: data.error?.message ?? null
    }
  }

  async getAllPagination({offset=0, limit=1}): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset+limit-1)
      .order('id') as ISupabaseResponse

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

  async insert(object: IRegisterProductDto): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('products')
      .insert([object])
      .select() as ISupabaseResponse

    return {
      data: (data.data) ? data.data[0].id : null,
      pagination: null,
      success: (data.status == 201) ? true : false,
      message: data.error?.message ?? ''
    }
  }

  async delete(id: number): Promise<IDataResponse> {
    const supabase = Supabase.connect(this.requestEvent)
    const data = await supabase
      .from('products')
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
