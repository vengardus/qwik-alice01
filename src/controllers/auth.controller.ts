import { type RequestEventBase } from "@builder.io/qwik-city";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { Auth } from "~/domain/model/auth.model";
import { SignJWT } from "jose";

export class AuthController {
    constructor(private requestEvent: RequestEventBase) { }

    async login(dataAuth: {
        username: string,
        password: string
    }): Promise<{
        success: boolean,
        message: string,
        user: IUserEntity | null
    }> {
        const oAuth = new Auth()
        const response = await oAuth.login(this.requestEvent, dataAuth)

        if (response.success) {
            // const secret = new TextEncoder().encode(
            //     'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
            // )
            const secret = new TextEncoder().encode(
                this.requestEvent.env.get('APP_TOKEN_KEY')
            )
            const alg = 'HS256'
            const data = {
                id: response.user?.id,
                usrname: response.user?.username
            }
            const jwt = await new SignJWT(data)
                .setProtectedHeader({ alg })
                .setIssuedAt()
                .setExpirationTime('2h')
                .sign(secret)

            console.log(jwt)

            this.requestEvent.cookie.set(
                'app-token',
                jwt,
                { secure: true, path: '/' }
            )
        }

        return response
    }


}