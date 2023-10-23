import { SupabaseModel } from "../supabase.model"
import { type DBSupabase } from "../supabase"
import { type IModel } from "~/domain/core/interfaces/model.interface"

export interface IUserModel extends IModel{
    //id: number,
    uid: string,
    username: string,
    password: string,
    email: string,
    role: string
}

export class UserModel extends SupabaseModel {
    TO: IUserModel | null
    aTO: IUserModel[]
    tableName: string
    static modelName: string = 'Usuario'
    static pluralModalName: string = 'Usuarios'

    constructor(oDb: DBSupabase) {
        super(oDb)
        this.TO = null
        this.aTO = []
        this.tableName = 'users'
    }

}

