import { type IRegisterCategoryDto } from "../dtos/category.dto"
import { type ICategoryEntity } from "../entity/category.entity"

export class Category {
    static modelName = 'Categoría'
    static modelNamePlural = 'Categorias'

    constructor(
        private aTO: ICategoryEntity[] = []
    ) { }

    count() {
        return this.aTO.length
    }

    getATO() {
        return this.aTO
    }

    setATO(data: ICategoryEntity[]) {
        this.aTO = data
    }

    static preValidateObject(object: { [key: string]: any })
        : string | undefined {
        const { name } = object
        if (!name) return 'Ingrese nombre'
        return undefined
    }

    static validateObject(object: { [key: string]: any })
        : [string?, IRegisterCategoryDto?] {
        const { name } = object
        const messageError = this.preValidateObject(object)
        if (messageError) return [messageError, undefined]

        return [undefined, {
            name: String(name).toUpperCase(),
        }]
    }
}