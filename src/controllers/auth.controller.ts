import { type RequestEventBase } from "@builder.io/qwik-city";
import { type IUserEntity } from "~/domain/entity/user.entity";
import { Auth } from "~/domain/model/auth.model";

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
        if (response.success)
            this.requestEvent.cookie.set(
                'app-token',
                this.requestEvent.env.get('APP_TOKEN_KEY')!,
                { secure: true, path: '/' }
            )

        return response
    }
}