import { SupabaseModel } from "../supabase.model"
import { type DBSupabase } from "../supabase"

export interface IUserModel {
    id: number,
    uid: string,
    username: string,
    password: string,
    email: string,
    role: string
}

interface IProductModel {
    id: number
    name: string
    description: string
    price: number
    currency: string
}

export interface ICategoryModel {
    id: number
    name: string
    created_at: any
    update_at: any
}

export class UserModel extends SupabaseModel {
    TO: IUserModel | null
    aTO: IUserModel[]
    tableName: string
    modelName: string
    pluralModalName: string

    constructor(oDb: DBSupabase) {
        super(oDb)
        this.TO = null
        this.aTO = []
        this.tableName = 'users'
        this.modelName = 'Usuario'
        this.pluralModalName = 'Usuarios'
    }

}

export class ProductModel extends SupabaseModel {
    TO: IProductModel | null
    aTO: IProductModel[]
    tableName: string
    modelName: string
    pluralModalName: string

    constructor(oDb: DBSupabase) {
        super(oDb)
        this.TO = null
        this.aTO = []
        this.tableName = 'products'
        this.modelName = 'Producto'
        this.pluralModalName = 'Productos'
    }

}

export class CategoryModel extends SupabaseModel {
    TO: any
    aTO: any[]
    tableName: string
    modelName: string
    pluralModalName: string

    constructor(oDb:DBSupabase) {
        super(oDb)
        this.TO = null
        this.aTO=[]
        this.tableName='categories'
        this.modelName='Categoría'
        this.pluralModalName='Categorias'
    }
}



