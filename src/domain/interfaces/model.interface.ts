import { type IDataResponse } from "~/domain/dtos/app.dto"

export abstract class Model {
    abstract TO: any | null
    abstract aTO: any[]
    abstract readonly tableName: string
    static readonly modelName: string = ''
    static readonly pluralModalName: string = ''
    message: string = ''

    count(): number {
        return this.aTO.length
    }

    static preValidateObject(object: { [key: string]: any }): string | undefined {
        // verifica que exista cada elemento, caso contrario devuelve mensaje error
        console.log(object)
        return
    }

    static validateObject(object: { [key: string]: any })
        : [string | undefined, object:object] {
        // validaciones extras, devuele mensaje de error y object
        return [undefined, object]
    }

    static initInputs(): { [key: string]: string } {
        return {}
    }

    abstract getAll(): Promise<IDataResponse>

    abstract getById(value: number): Promise<IDataResponse>

    abstract getByColumn(column: string, value: string | number): Promise<IDataResponse>

    abstract insert(object: object): Promise<IDataResponse>

    abstract getAllPagination({ offset = 0, limit = 1 }:{offset:number, limit:number}): Promise<IDataResponse>

    abstract update(id: number, object: object): Promise<IDataResponse> 

    abstract delete(id: number): Promise<IDataResponse> 
}