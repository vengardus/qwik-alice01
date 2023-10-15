import { type RequestEventBase } from "@builder.io/qwik-city";
import { type JWTPayload } from "jose";
import { envs } from "~/config/envs";
import { JoseAdapter } from "~/config/jose";
import { AppConfig } from "~/domain/app.config";

export class AuthMiddleware {
    static verifyJWT = async (requestEvent: RequestEventBase)
        : Promise<JWTPayload | null> => {
        // get cookie
        const jwt = requestEvent.cookie.get(AppConfig.KEYS.cokieNameJwt)?.value
        if (!jwt) return null
        // verify jwt
        const payload = await JoseAdapter.verifyToken(
            jwt,
            envs(requestEvent).JWT_PRIVATE_KEY!
        )
        // verify user exists
        if ( payload ) {
            const {uuid} = payload as {uuid:string}
            
        }
            

        return payload
    }
}