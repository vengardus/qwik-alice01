import { type UserModel } from "~/data/supabase/models/user.model";
import { type AuthDatasource } from "~/domain/datasource/auth.datasource";
import { type ILoginUserDto } from "~/domain/dtos/auth.dto";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { UserMapper } from "../mappers/user.mapper";

export class AuthDatasourceImpl implements AuthDatasource {

    constructor(private readonly oUser:UserModel) {}

    async login(loginUserDto: ILoginUserDto): Promise<IUserEntity | null> {
        const { username, password } = loginUserDto
        await this.oUser.getByColumn('username', username)
        if (!this.oUser.TO) return null
        if ( this.oUser.TO.password !== password ) return null

        return UserMapper.userEntityFromUserModel(this.oUser.TO)
    }


}