import { SupabaseModel } from "../supabase.model"
import { type DBSupabase } from "../supabase"


export interface ICategoryModel {
    id: number
    name: string
    created_at: any
    update_at: any
}

export class CategoryModel extends SupabaseModel  {
    TO: ICategoryModel | null
    aTO: ICategoryModel[]
    tableName: string
    static modelName: string = 'Categoría'
    static pluralModalName: string = 'Categorías'

    constructor(oDB:DBSupabase) {
        super(oDB)
        this.TO = null
        this.aTO = []
        this.tableName='categories'
    }

    static preValidateObject(object: { [key: string]: any }): string | undefined {
        const { name } = object
        if (!name) return 'Ingrese nombre'
        return undefined    
    }

    static validateObject(object: { [key: string]: any }): [string | undefined, object: object] {
        const { name } = object
        const messageError = this.preValidateObject(object)
        if (messageError) return [messageError, object]

        return [undefined, {
            name: String(name).toUpperCase(),
        }]    
    }

    
}


