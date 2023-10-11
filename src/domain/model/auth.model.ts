import { type RequestEventBase } from "@builder.io/qwik-city";
import { User } from "./user.model";
import { AuthService } from "~/infrastructure/data/supabase/auth.service";
import { type IUserEntity } from "../entity/user.entity";
import { CustomMessages } from "../messages/customMessages";

export class Auth extends User {

    constructor() {
        super()
    }

    async login(requestEvent: RequestEventBase, dataAuth: {
        username: string,
        password: string
    }): Promise<{
        success: boolean,
        message: string,
        user: IUserEntity | null
    }> {
        const response = {
            success: false,
            message: '',
            user: null
        }
        const oAuthService = new AuthService(requestEvent)
        const dataResponse = await oAuthService.login(dataAuth)
        if (!dataResponse.success) response.message = CustomMessages.msgAuthError(dataResponse.message || '')
        if (!dataResponse.data || !dataResponse.data.length) 
            response.message = CustomMessages.msgAuthNotValid()
        else {
            response.user = dataResponse.data[0]
            response.success = true
        }

        return response
    }
}