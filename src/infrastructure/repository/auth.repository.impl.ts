import { type AuthDatasource } from "~/domain/datasource/auth.datasource";
import type { ILoginUserDto } from "~/domain/dtos/auth.dto";
import { type IRegisterUserDto } from "~/domain/dtos/user.dto";
import type { IUserEntity } from "~/domain/entity/user.entity";
import { type AuthRepository } from "~/domain/reposiory/auth.repository";

export class AuthRepositoryImpl implements AuthRepository {
    
    constructor(private readonly authDatasource:AuthDatasource) {}
    
    async login(loginUserDto: ILoginUserDto): Promise<IUserEntity | null> {
        return this.authDatasource.login(loginUserDto)
    }

    async registerUser(registerUserDto: IRegisterUserDto): Promise<[string|undefined, IUserEntity | null]> {
        return this.authDatasource.registerUser(registerUserDto)
    }

}