import { type UserModel } from "~/infrastructure/data/supabase/models/user.model";
import { type AuthDatasource } from "~/domain/datasource/auth.datasource";
import { type ILoginUserDto } from "~/domain/dtos/auth.dto";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import type { IRegisterUserDto } from "~/domain/dtos/user.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { BcryptAdapter } from "~/config/bcrypt";



type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

    constructor(
        private readonly oUser: UserModel,
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    ) { }

    async login(loginUserDto: ILoginUserDto): Promise<IUserEntity | null> {
        const { username, password } = loginUserDto
        await this.oUser.getByColumn('username', username)
        if (!this.oUser.TO) return null
        if (!this.comparePassword(password, this.oUser.TO.password)) return null

        return UserMapper.userEntityFromUserModel(this.oUser.TO)
    }

    async registerUser(registerUserDto: IRegisterUserDto): Promise<[string | undefined, IUserEntity | null]> {
        const { username } = registerUserDto
        // busca usuario por username
        await this.oUser.getByColumn('username', username)
        if (this.oUser.TO) return [CustomMessages.msgAuthSignInUserExist(), null]

        // genera hash para el password
        registerUserDto.password = this.hashPassword(registerUserDto.password)

        const data = await this.oUser.insert(registerUserDto)
        if (!this.oUser.TO) return [data.message ?? '', null]
        return [undefined, UserMapper.userEntityFromUserModel(this.oUser.TO)]
    }

}