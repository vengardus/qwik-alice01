import { Model } from "~/domain/interfaces/model.interface"
import { type IDataResponse } from "~/domain/dtos/app.dto"
import { type DBSupabase } from "./supabase"


export abstract class SupabaseModel extends Model {
    private oDB: DBSupabase

    constructor(oDb: DBSupabase) {
        super()
        this.oDB = oDb
    }

    async getAll(): Promise<IDataResponse> {
        const data = await this.oDB.getAll(this.tableName)
        this.aTO = data.data
        return data
    }

    async getById(value: number): Promise<IDataResponse> {
        const data = await this.oDB.getById(this.tableName, value)
        this.TO = data.data[0] ?? null
        return data
    }

    async getByColumn(column: string, value: string | number): Promise<IDataResponse> {
        const data = await this.oDB.getByColumn(this.tableName, column, value)
        this.TO = data.data ? data.data[0] : null
        return data
    }
}
