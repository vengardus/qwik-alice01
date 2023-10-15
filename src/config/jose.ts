import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { AppConfig } from "~/domain/app.config";

const ALG = AppConfig.JWT.alg
const EXPIRATION = AppConfig.JWT.expiration

export class JoseAdapter {

    static async generateToken(
        data: { [key: string]: any },
        jwtPrivateKey: string
    ): Promise<string> {
        const secret = new TextEncoder().encode(jwtPrivateKey)
        const alg = ALG
        const jwt = await new SignJWT(data)
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime(EXPIRATION)
            .sign(secret)
        return jwt
    }

    static async verifyToken(
        jwt: string,
        jwtPrivateKey: string
    ): Promise<JWTPayload | null> {
        const secret = new TextEncoder().encode(jwtPrivateKey)

        try {
            const { payload } = await jwtVerify(jwt, secret)
            return payload
        }
        catch (err) {
            return null
        }

    }
}