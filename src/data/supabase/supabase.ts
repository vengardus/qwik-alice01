import { type RequestEventBase } from "@builder.io/qwik-city";
import { createServerClient } from 'supabase-auth-helpers-qwik';
import { envs } from "~/config/envs";
import { DB } from "../../domain/interfaces/db.interface";
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


}