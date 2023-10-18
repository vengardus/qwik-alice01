import { type IDataResponse } from "~/domain/dtos/app.dto";

export abstract class DB {
    abstract readonly connect: unknown
    abstract getAll(tableName: string): Promise<IDataResponse>
    abstract getById(tableName: string, value: number, column?: string): Promise<IDataResponse>
    abstract getByColumn(tableName: string, column: string, value: string): Promise<IDataResponse>
    abstract insert(tablename:string, object: object): Promise<IDataResponse> 

}