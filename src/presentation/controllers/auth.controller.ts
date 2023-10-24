import { type RequestEventBase } from "@builder.io/qwik-city";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { JoseAdapter } from "~/config/jose";
import { AppConfig } from "~/domain/app.config";
import { envs } from "~/config/envs";
import { DBSupabase } from "~/infrastructure/data/supabase/supabase";
import { type ILoginUserDto } from "~/domain/dtos/auth.dto";
import { AuthRepositoryImpl } from "~/infrastructure/repository/auth.repository.impl";
import { AuthDatasourceImpl } from "~/infrastructure/datasource/auth.datasource.impl";
import { CustomMessages } from "~/domain/messages/customMessages";
import { UserModel } from "~/infrastructure/data/supabase/models/user.model";
import { type IRegisterUserDto } from "~/domain/dtos/user.dto";


type GenerateToken = (payload: Object, jwtPrivateKey: string) => Promise<string | null>;


export class AuthController {
    message: string

    constructor(
        private readonly requestEvent: RequestEventBase,
        private readonly generateToken: GenerateToken = JoseAdapter.generateToken
    ) {
        this.message = ''
    }

    private returnError(message: string): null {
        this.message = message
        return null
    }

    async loginUser(loginUserDto: ILoginUserDto): Promise<IUserEntity | null> {
        const oUser = new UserModel(new DBSupabase(this.requestEvent))
        const oAuthDatasourceImpl = new AuthDatasourceImpl(oUser)
        const oAuthRepositoryImpl = new AuthRepositoryImpl(oAuthDatasourceImpl)
        const userEntity = await oAuthRepositoryImpl.login(loginUserDto)
        if (!userEntity) return this.returnError(CustomMessages.msgAuthNotValid())

        // genera token
        // const jwt = await this.generateToken({ uid: userEntity.uid }, envs(this.requestEvent).JWT_PRIVATE_KEY!)
        // if (!jwt) return this.returnError(CustomMessages.msgAuthError('No se pudo generar token.'))
        // // save cookie
        // this.requestEvent.cookie.set(AppConfig.KEYS.cokieNameJwt, jwt!, { secure: true, path: '/' })
        //return userEntity
        return this.saveCookie(userEntity)
    }

    async registerUser(registerUser: IRegisterUserDto): Promise<IUserEntity | null> {
        console.log('controller-registerUser')
        const oUser = new UserModel(new DBSupabase(this.requestEvent))
        const oAuthDatasourceImpl = new AuthDatasourceImpl(oUser)
        const oAuthRepositoryImpl = new AuthRepositoryImpl(oAuthDatasourceImpl)
        const [messageError, userEntity] = await oAuthRepositoryImpl.registerUser(registerUser)
        this.message = messageError?? ''
        console.log('registerUser:', messageError, userEntity)
        if (!userEntity) return null
        
        return this.saveCookie(userEntity)
    }

    async logout() {
        this.requestEvent.cookie.delete(AppConfig.KEYS.cokieNameJwt, { path: '/' })
    }

    private async saveCookie(userEntity: IUserEntity): Promise<IUserEntity | null> {
        // genera token
        const jwt = await this.generateToken({ uid: userEntity.uid }, envs(this.requestEvent).JWT_PRIVATE_KEY!)
        if (!jwt) return this.returnError(CustomMessages.msgAuthError('No se pudo generar token.'))

        // save cookie
        this.requestEvent.cookie.set(AppConfig.KEYS.cokieNameJwt, jwt!, { secure: true, path: '/' })

        return userEntity
    }

}