import { type RequestEventBase } from "@builder.io/qwik-city";
import { createServerClient } from 'supabase-auth-helpers-qwik';
import { envs } from "~/config/envs";
import { DB } from "../../domain/core/interfaces/db.interface";
import { type IDataResponse } from "~/domain/dtos/app.dto";

export interface ISupabaseResponse {
    error: {
        code: string,
        details: any,
        hint: any,
        message: string
    } | null,
    data: any[] | null,
    count: any | null,
    status: number,
    statusText: string
}


export class DBSupabase extends DB {

    connect

    constructor(requestEvent: RequestEventBase) {
        super()
        this.connect = this.connectDb(requestEvent)
    }

    private connectDb(requestEvent: RequestEventBase) {
        return createServerClient(
            envs(requestEvent).PUBLIC_SUPABASE_URL!,
            envs(requestEvent).PUBLIC_SUPABASE_ANON_KEY!,
            requestEvent
        );
    }

    async getAll(tableName: string): Promise<IDataResponse> {
        const data = await this.connect
            .from(tableName)
            .select("*")

        return {
            data: data.data,
            pagination: null,
            success: data.error ? false : true,
            message: data.error?.message ?? null
        }

    }

    async getAllPagination(tablename: string, { offset = 0, limit = 1 }: { offset: number, limit: number }): Promise<IDataResponse> {
        const data = await this.connect
            .from(tablename)
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1)
            .order('name', { ascending: true }) as ISupabaseResponse

        return {
            data: data.data,
            pagination: {
                // OBS: supabase devuelve data con [] cuando offset == count (debería ser null como cuando es > count)
                offset: (data.data && data.data.length) ? offset : 0,
                count: (data.data && data.data.length && data.count) ? data.count : 0
            },
            success: data.error ? false : true,
            message: data.error?.message ?? null
        }
    }

    async getById(tableName: string, value: number, column: string = 'id'): Promise<IDataResponse> {
        return this.getByColumn(tableName, column, value)
    }

    async getByColumn(tableName: string, column: string, value: string | number): Promise<IDataResponse> {
        const data = await this.connect
            .from(tableName)
            .select("*")
            .eq(column, value)

        return {
            data: data.data,
            pagination: null,
            success: data.error ? false : true,
            message: data.error?.message ?? null
        }
    }

    async insert(tablename: string, object: object): Promise<IDataResponse> {
        const data = await this.connect
            .from(tablename)
            .insert([object])
            .select()

        return {
            data: (data.data) ? data.data : null,
            pagination: null,
            success: (data.status == 201) ? true : false,
            message: data.error?.message ?? null
        }
    }

    async update(tablename: string, id: number, object: object): Promise<IDataResponse> {
        const data = await this.connect
            .from(tablename)
            .update(object)
            .eq('id', id)

        return {
            data: (data.data),
            pagination: null,
            success: (data.status == 204) ? true : false,
            message: data.error?.message ?? ''
        }
    }

    async delete(tablename: string, id: number): Promise<IDataResponse> {
        const data = await this.connect
            .from(tablename)
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