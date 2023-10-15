import { type RequestEventBase } from "@builder.io/qwik-city"
import { type IRegisterUserDto } from "../dtos/user.dto"
import { type IUserEntity } from "../entity/user.entity"


export class User {
    static modelName = 'Usuario'
    static modelNamePlural = 'Usuarios'

    constructor(
        private aTO: IUserEntity[] = []
    ) { }

    count() {
        return this.aTO.length
    }

    getATO() {
        return this.aTO
    }

    setATO(data: IUserEntity[]) {
        this.aTO = data
    }

    static preValidateObject(object: { [key: string]: any })
        : string | undefined {
        const { name } = object
        if (!name) return 'Ingrese nombre'
        return undefined
    }

    static validateObject(object: { [key: string]: any })
        : [string?, IRegisterUserDto?] {
        const messageError = this.preValidateObject(object)
        if (messageError) return [messageError, undefined]
        const { username, password } = object

        return [undefined, {
            username: String(username).toUpperCase(),
            password: String(password),
            email: '',
            profileType: 'user'
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
