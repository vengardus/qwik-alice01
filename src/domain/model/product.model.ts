import { type IProductEntity } from "../entity/product.entity"
import type { IRegisterProductDto } from "../dtos/product.dto"


export class Product {
    static modelName = 'Producto'
    static modelNamePlural = 'Productos'

    constructor(
        private aTO: IProductEntity[] = []
    ) { }

    count() {
        return this.aTO.length
    }

    getATO() {
        return this.aTO
    }

    setATO(data: IProductEntity[]) {
        this.aTO = data
    }

    static preValidateObject(object: { [key: string]: any })
        : string | undefined {
        const { name, description, price, currency } = object
        if (!name) return 'Ingrese nombre'
        if (!description) return 'Ingrese descripción'
        if (!price) return 'Ingrese precio'
        if (!currency) return 'Ingrese currency'
        return undefined
    }

    static validateObject(object: { [key: string]: any })
        : [string?, IRegisterProductDto?] {
        const { name, description, price, currency } = object
        const messageError = this.preValidateObject(object)
        if (messageError) return [messageError, undefined]
        
        const priceToNumber = Number(price);
        if (Number.isNaN(priceToNumber) || priceToNumber <= 0) return ['Error en precio']

        return [undefined, {
            name: String(name).toUpperCase(),
            description: String(description).toUpperCase(),
            price: Number(price),
            currency: String(currency).toUpperCase()
        }]
    }


}