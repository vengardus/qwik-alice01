import { type RequestEventBase } from "@builder.io/qwik-city";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { JoseAdapter } from "~/config/jose";
import { AppConfig } from "~/domain/app.config";
import { envs } from "~/config/envs";
import { DBSupabase } from "~/data/supabase/supabase";
import { type ILoginUserDto } from "~/domain/dtos/auth.dto";
import { AuthRepositoryImpl } from "~/infrastructure/repository/auth.repository.impl";
import { AuthDatasourceImpl } from "~/infrastructure/datasource/auth.datasource.impl";
import { CustomMessages } from "~/domain/messages/customMessages";
import { UserModel } from "~/data/supabase/models/user.model";


type GenerateToken = (payload: Object, jwtPrivateKey: string) => Promise<string | null>;


export class AuthController {
    message: string

    constructor(
        private readonly requestEvent: RequestEventBase,
        private readonly generateToken: GenerateToken = JoseAdapter.generateToken
    ) {
        this.message = ''
    }
    
    async loginUser(loginUserDto: ILoginUserDto): Promise<IUserEntity | null> {

        const oUser = new UserModel(new DBSupabase(this.requestEvent))
        const oAuthDatasource = new AuthDatasourceImpl(oUser)
        const oAuthRepository = new AuthRepositoryImpl(oAuthDatasource)
        const userEntity = await oAuthRepository.login(loginUserDto)
        if (!userEntity) {
            this.message = CustomMessages.msgAuthNotValid()
            return null
        }

        // genera token
        const data = {
            id: userEntity.uid
        }
        const jwt = await this.generateToken(
            data,
            envs(this.requestEvent).JWT_PRIVATE_KEY!
        )
        if (!jwt) {
            this.message = CustomMessages.msgAuthError('No se pudo generar token.')
            return null
        }

        // save cookie
        this.requestEvent.cookie.set(
            AppConfig.KEYS.cokieNameJwt,
            jwt!,
            { secure: true, path: '/' }
        )

        return userEntity
    }

}