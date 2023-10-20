import { SupabaseModel } from "../supabase.model"
import { type DBSupabase } from "../supabase"

export interface IProductModel {
    id: number
    name: string
    description: string
    price: number
    currency: string
}

export class ProductModel extends SupabaseModel {
    TO: IProductModel | null
    aTO: IProductModel[]
    tableName: string
    static modelName: string = 'Producto'
    static pluralModalName: string = 'Productos'

    constructor(oDb: DBSupabase) {
        super(oDb)
        this.TO = null
        this.aTO = []
        this.tableName = 'products'
    }

    static preValidateObject(object: { [key: string]: any }): string | undefined {
        const { name, description, price, currency } = object
        if (!name) return 'Ingrese nombre'
        if (!description) return 'Ingrese descripción'
        if (!price) return 'Ingrese precio'
        if (!currency) return 'Ingrese currency'
        return undefined
    }

    static validateObject(object: { [key: string]: any })
        : [string | undefined, object] {
        const { name, description, price, currency } = object
        const messageError = this.preValidateObject(object)
        if (messageError) return [messageError, object]

        const priceToNumber = Number(price);
        if (Number.isNaN(priceToNumber) || priceToNumber <= 0) return ['Error en precio', object]

        return [undefined, {
            name: String(name).toUpperCase(),
            description: String(description).toUpperCase(),
            price: Number(price),
            currency: String(currency).toUpperCase()
        }]
    }

    static initInputs(): {
        id: string,
        description: string,
        name: string,
        currency: string,
        price: string
    } {
        return {
            id: '',
            description: '',
            name: '',
            currency: 'USD',
            price: '',
        }
    }
}



