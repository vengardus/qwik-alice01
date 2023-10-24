import { type RequestEventBase } from "@builder.io/qwik-city";
import { envs } from "~/config/envs";
import { JoseAdapter } from "~/config/jose";
import { UserModel } from "~/infrastructure/data/supabase/models/user.model";
import { DBSupabase } from "~/infrastructure/data/supabase/supabase";
import { AppConfig } from "~/domain/app.config";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { CustomMessages } from "~/domain/messages/customMessages";
import { UserMapper } from "~/infrastructure/mappers/user.mapper";


export class AuthMiddleware {

    static verifyJWT = async (requestEvent: RequestEventBase)
        : Promise<[messageerror: string | undefined, userEntity: IUserEntity | null]> => {
        // get cookie
        const jwt = requestEvent.cookie.get(AppConfig.KEYS.cokieNameJwt)?.value
        if (!jwt) return [CustomMessages.msgAuthErrorTokenNotFound(), null]

        // verify jwt
        const payload = await JoseAdapter.verifyToken(jwt, envs(requestEvent).JWT_PRIVATE_KEY!)
        if (!payload) return [CustomMessages.msgAuthErrorTokenNotValid(), null]

        // verify user exists
        const { uid } = payload as { uid: string }
        const oUser = new UserModel(new DBSupabase(requestEvent))
        await oUser.getByColumn('uid', uid)
        if (!oUser.TO) return [CustomMessages.msgAuthErrorTokenUser(), null]

        return [undefined, UserMapper.userEntityFromUserModel(oUser.TO)]
    }
}